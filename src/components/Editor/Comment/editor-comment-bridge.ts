import { nextTick, watch, watchSyncEffect } from 'vue'
import type { Ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { MutateResult } from '@vue/apollo-composable'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'
import * as Sentry from '@sentry/vue'
import type { Thread } from './definitions'
import { useSentryFlagStore } from '~/stores/sentry-flag'
import type { AnnotationPosition } from '~/components/Editor/core/tiptap/plugins/collaboration-annotation'
import { raf } from '~/utils'
import { dayjs } from '~/lib/dayjs'
import { useComment } from '~/stores/comment'
import { useDebugLog } from '~/composables'
import type { ResolveThreadMutation } from '~/graphql-operations'
import { ThreadFragmentDoc } from '~/graphql-operations'
import { useApolloClient } from '~/lib/apollo'

export interface UseBindCommentAndAnnotationInput {
  editor: Editor
}

export function useBindCommentAndAnnotation(
  props: UseBindCommentAndAnnotationInput,
  threads: Readonly<Ref<Thread[]>>,
  resolveThread: (data: { id: string }) => MutateResult<ResolveThreadMutation>,
) {
  const debug = useDebugLog('editor-comment-bridge')
  const commentStore = useComment()
  const removed = new Set()
  const added = new Set()
  const cleaned = new Set()
  const lastPendingId = ref<string | undefined>('')
  const threadTop = ref<AnnotationPosition[]>([])
  const { client } = useApolloClient()

  debug('comment system booting, host', window.top === window)

  // sync annotations -> comment
  // remove invalid comments (comment without annotations)
  function cleanupThreads(threads: Thread[]) {
    const annotations = new Set<string>(
      props.editor.storage.annotation.positions.map(({ id }: AnnotationPosition) => id),
    )

    debug('start cleanup', { cleaned, threads, annotations })

    for (const thread of threads) {
      // handle resolve because of annotation removed
      if (!annotations.has(thread.id) && !thread.resolved && !cleaned.has(thread.id) && isValidCommentID(thread.id)) {
        debug('remove comment', thread.id)
        cleaned.add(thread.id)
        handleResolvedThread(client, thread.id, resolveThread(thread))
      }
    }

    if (commentStore.pendingThread?.id) {
      lastPendingId.value = commentStore.pendingThread?.id
    }

    const noPending = Array.from(annotations).every((name) => !name.startsWith('temp-'))
    if (noPending) {
      // remove dangling pending comment because of annotation remove
      removeComment({ id: lastPendingId.value as string })
      commentStore.pendingThread = null
      lastPendingId.value = ''
    }
  }

  const INVALID_PREFIX = ['opt-', 'temp-']
  function isValidCommentID(id: string) {
    return !INVALID_PREFIX.some((prefix) => id.startsWith(prefix))
  }

  function cleanupPendingComment() {
    const annotations = new Set<string>(
      props.editor.storage.annotation.positions.map(({ id }: AnnotationPosition) => id),
    )

    if (commentStore.pendingThread?.id && annotations.has(commentStore.pendingThread?.id)) {
      props.editor.commands.deleteAnnotation(commentStore.pendingThread?.id)
      commentStore.pendingThread = null
    }
  }

  function removeComment({ id }: Pick<Thread, 'id'>) {
    if (removed.has(id)) {
      return
    }
    removed.add(id)

    // delete the pending comment when API returns
    if (commentStore.pendingThread?.id === id) {
      debug('remove pending comment', id)
      commentStore.pendingThread = null
    }

    const sentryFlagStore = useSentryFlagStore()

    if (isValidCommentID(id) && sentryFlagStore.deletedCommentId && sentryFlagStore.deletedCommentId !== id) {
      Sentry.captureException(new Error(`Comment unexpectedly deleted: ${id}`))
    }

    debug('delete annotation', id)

    // remove resolved/non-existing threads
    props.editor.commands.deleteAnnotation(id)
  }

  async function addComment(thread: Thread) {
    if (added.has(thread.id)) {
      return
    }
    // remove the old pending comment
    removeComment({ id: thread.position.id })
    added.add(thread.id)
    // make sure not already managed by the editor
    // use extensionStorage to make sure get the latest value (storage has debounce)
    const found = props.editor.extensionStorage.annotation.positions.find(
      ({ id }: AnnotationPosition) => thread.id === id,
    )
    if (!found) {
      debug('add annotation', thread.id)
      // HACK: no idea, but we need to wait to next tick to make it work
      await nextTick()
      // add annotation so the position is managed by the editor
      props.editor.commands.addComment(thread.id, thread.position.from, thread.position.to)
    } else {
      debug('already managed', thread.id)
    }
  }

  onUnmounted(() => {
    cleanupPendingComment()
  })

  useEventListener('beforeunload', () => {
    cleanupPendingComment()
  })

  // convert comment -> annotation
  watch(threads, (threads, old) => {
    // ask editor to refresh the annotations
    props.editor.commands.refreshAnnotation()
    const seen = new Set()
    for (const thread of threads) {
      seen.add(thread.id)
      if (thread.resolved) {
        // FIXME: seems impossible to handle like this because backend will directly remove resolved comments
        removeComment(thread)
      } else {
        addComment(thread)
      }
    }

    for (const thread of old) {
      if (!seen.has(thread.id)) {
        debug('clean up', thread.id)
        removeComment(thread)
      }
    }
  })

  // ask editor to refresh the annotations on every change
  watchSyncEffect((onCleanup) => {
    const { editor } = props
    // cleanup old threads
    added.clear()
    removed.clear()
    cleaned.clear()

    debug('editor refresh')

    const observer = new ResizeObserver(handleUpdate)
    observer.observe(editor.view.dom)

    editor.on('transaction', handleTransition)
    editor.on('update', handleUpdate)

    onCleanup(() => {
      observer.disconnect()
      editor.off('transaction', handleTransition)
      editor.off('update', handleUpdate)
    })

    async function handleUpdate() {
      // Sync the editor with the comment store
      // The annotation that managed by editor will be updated into the comment store
      commentStore.SET_THREAD_TOP(editor.storage.annotation.positions)
      editor.commands.refreshAnnotation()

      await nextTick()

      // check invalid threads after editor finished refresh annotations
      cleanupThreads(threads.value)
    }

    async function handleTransition() {
      await raf()
      if (editor.storage.annotation.positions.length !== threadTop.value.length) {
        commentStore.SET_THREAD_TOP(editor.storage.annotation.positions)
      }
      threadTop.value = editor.storage.annotation.positions
    }
  })

  watch(
    () => props.editor.storage,
    () => {
      commentStore.SET_THREAD_TOP(props.editor.storage.annotation.positions)
    },
  )

  watch(threadTop, (nowThreads) => {
    const validThreads = nowThreads.filter((thread) => isValidCommentID(thread.id))
    commentStore.SET_THREAD_TOP(validThreads)
  })

  return {
    async doResolveThread(data: { id: string }) {
      await handleResolvedThread(client, data.id, resolveThread(data))
      removeComment(data)
    },
  }
}

async function handleResolvedThread(
  client: ApolloClient<NormalizedCacheObject>,
  id: string,
  result: MutateResult<ResolveThreadMutation>,
) {
  const debug = useDebugLog('editor-comment-bridge:resolved-thread')
  try {
    const res = await result
    const id = res?.data?.resolveArticleThread?.id
    if (id) {
      debug('resolved thread', id)
    }
  } catch {
    client.cache.updateFragment(
      {
        fragment: ThreadFragmentDoc,
        fragmentName: 'Thread',
        id: `ArticleThread:${id}`,
      },
      (data) => {
        debug('resolved fail -> force resolved', id)
        if (!data) {
          return
        }
        return {
          ...data,
          resolved_at: dayjs().toDateTimeString(),
        }
      },
    )
  }
}
