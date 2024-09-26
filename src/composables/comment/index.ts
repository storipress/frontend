import invariant from 'tiny-invariant'
import { computed } from 'vue'
import type { MaybeRef } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useDebugLog } from '../debug-log'
import { dayjs } from '~/lib/dayjs'
import { query as apolloQuery } from '~/lib/apollo'
import { useMeStore } from '~/stores/me'
import {
  CreateNoteDocument,
  CreateThreadDocument,
  ListThreadsDocument,
  RemoveNoteDocument,
  ResolveThreadDocument,
  ThreadFragmentDoc,
  UpdateNoteDocument,
} from '~/graphql-operations'
import type {
  CreateArticleThreadInput,
  CreateNoteMutation,
  CreateThreadMutation,
  Exact,
  ListThreadsQuery,
  ThreadFragment,
} from '~/graphql-operations'
import { useEditorStore } from '~/stores/editor'
import { getAvatarURL } from '~/lib/avatar'
import type { Thread } from '~/components/Editor/Comment/definitions'
import { useCommentYdocStore } from '~/pages/[clientID]/articles/[id]/edit/store/comment'
import { normalizeNote } from '~/components/Editor/Comment/helpers'

const defaultAvatar = getAvatarURL('Loading...')

const stubUser = {
  id: 'stub',
  full_name: 'Loading...',
  avatar: defaultAvatar,
}

export type CommentAPIReturn = ReturnType<typeof useCommentAPI>

function createOptimisticThread({
  input: { article_id, position },
}: Exact<{ input: CreateArticleThreadInput }>): CreateThreadMutation {
  return {
    __typename: 'Mutation',
    createArticleThread: {
      __typename: 'ArticleThread',
      id: extractPendingThreadId(position),
      article_id,
      position,
      notes: [],
      created_at: dayjs().toISOString(),
      resolved_at: null,
    },
  }
}

export function useCommentAPI(maybeProfile?: MaybeRef<{ id: string; full_name: string; avatar: string } | undefined>) {
  const commentStore = useCommentYdocStore()
  const meStore = useMeStore()
  const debug = useDebugLog('comment-api')
  const editorStore = useEditorStore()
  const route = useRoute()
  const profile = computed(() => {
    return {
      ...stubUser,
      ...unref(maybeProfile),
    }
  })

  const getYdocComments = () => {
    const ydoc = commentStore.ydoc
    const ydocComments = ydoc?.getMap('comments')
    return ydocComments
  }

  const { mutate: mutateCreateThread, onDone: onCreateThreadDone } = useMutation(CreateThreadDocument, {
    optimisticResponse: createOptimisticThread,
    update(cache, { data }) {
      debug('thread created -> update cache', data?.createArticleThread.id, data)
      if (!data || !data.createArticleThread) {
        return
      }

      const thread = data.createArticleThread
      cache.updateQuery(
        {
          query: ListThreadsDocument,
          variables: { id: thread.article_id },
        },
        (query): ListThreadsQuery | null => {
          if (!query || !query.article) {
            // Now only article id 492 query is null, so we send the same query again to get result
            apolloQuery(route.params.clientID as string, ListThreadsDocument, { id: thread.article_id })
            return null
          }

          return {
            ...query,
            __typename: 'Query',
            article: {
              ...query.article,
              __typename: 'Article',
              threads: [...query.article.threads.filter((t) => t.id !== thread.id), thread],
            },
          }
        },
      )
      if (/\d+/.test(thread.id)) {
        cache.updateFragment(
          {
            id: cache.identify(thread),
            fragment: ThreadFragmentDoc,
            fragmentName: 'Thread',
          },
          (fragment): ThreadFragment | null => {
            if (!fragment) {
              return null
            }
            return {
              ...fragment,
              __typename: 'ArticleThread',
              ...thread,
            }
          },
        )
      }
    },
  })
  onCreateThreadDone(({ data }) => {
    const { article_id, id } = data?.createArticleThread || {}
    if (!article_id || !id) return

    sendTrackUnchecked('comment_thread_created', {
      article_id,
      thread_id: id,
    })
  })

  const { mutate: replyThread, onDone: onCreateNoteDone } = useMutation(CreateNoteDocument, {
    optimisticResponse({ input }): CreateNoteMutation {
      return {
        __typename: 'Mutation',
        createNote: {
          __typename: 'ArticleThreadNote',
          id: 'temp-note',
          content: input.content,
          created_at: dayjs().toDateTimeString(),
          user: {
            __typename: 'User',
            ...profile.value,
          },
          thread: {
            __typename: 'ArticleThread',
            id: input.thread_id,
          },
        },
      }
    },
    update(cache, { data }) {
      if (!data) {
        return
      }

      const { createNote } = data
      const { thread } = createNote
      const ydocComments = getYdocComments()

      cache.updateFragment(
        {
          id: cache.identify(thread),
          fragment: ThreadFragmentDoc,
          fragmentName: 'Thread',
        },
        (threadData): ThreadFragment | null => {
          if (!threadData || createNote.id.startsWith('temp')) {
            return null
          }

          const { notes } = threadData
          const updatedThread = {
            ...threadData,
            notes: [
              ...(notes || []),
              {
                ...createNote,
              },
            ],
          }

          const articleThreads = ydocComments?.get('articleThreads') as Thread[]
          ydocComments?.set(
            'articleThreads',
            articleThreads.map((item) => {
              if (item.id === updatedThread.id) {
                return {
                  ...updatedThread,
                  position: JSON.parse(updatedThread.position),
                  notes: [...item.notes.filter((item) => !item.id.startsWith('temp')), normalizeNote(createNote)],
                }
              }
              return item
            }),
          )

          return updatedThread
        },
      )
    },
  })

  onCreateNoteDone(({ data }) => {
    const { thread, id } = data?.createNote || {}
    if (!thread?.id || !id) return

    sendTrackUnchecked('comment_note_created', {
      article_id: editorStore.id,
      thread_id: thread.id,
      note_id: id,
    })
  })

  const { mutate: mutateEditNote, onDone: onEditNoteDone } = useMutation(UpdateNoteDocument)

  function editNote(input: { id: string; content: string }, thread: Thread) {
    const ydocComments = getYdocComments()
    const articleThreads = ydocComments?.get('articleThreads') as Thread[]
    const targetThread = articleThreads.find((item) => item.id === thread.id)
    if (targetThread) {
      targetThread.notes = targetThread.notes.map((item) => {
        if (item.id === input.id) {
          return { ...item, content: input.content }
        }
        return item
      })
    }
    ydocComments?.set(
      'articleThreads',
      articleThreads.map((item) => {
        if (item.id === thread.id) {
          return targetThread
        }
        return item
      }),
    )
    mutateEditNote({ input })
  }

  onEditNoteDone(({ data }) => {
    const { thread, id } = data?.updateNote || {}
    if (!thread?.id || !id) return

    sendTrackUnchecked('comment_note_edited', {
      article_id: editorStore.id,
      thread_id: thread.id,
      note_id: id,
    })
  })

  const { mutate: mutateRemoveNote, onDone: onRemoveNoteDone } = useMutation(RemoveNoteDocument)

  function removeNote(input: { id: string }, thread: Thread) {
    const ydocComments = getYdocComments()
    const articleThreads = ydocComments?.get('articleThreads') as Thread[]
    const targetThread = articleThreads.find((item) => item.id === thread.id)

    ydocComments?.set(
      'articleThreads',
      articleThreads.map((item) => {
        if (item.id === thread.id) {
          return { ...targetThread, notes: targetThread?.notes.filter((item) => item.id !== input.id) }
        }
        return item
      }),
    )
    mutateRemoveNote(input)
  }

  onRemoveNoteDone(({ data }) => {
    const { thread, id } = data?.deleteNote || {}
    if (!thread?.id || !id) return

    sendTrackUnchecked('comment_note_removed', {
      article_id: editorStore.id,
      thread_id: thread.id,
      note_id: id,
    })
  })

  const { mutate: mutateResolveThread, onDone: onResolveThreadDone } = useMutation(ResolveThreadDocument)

  function resolveThread(data: { id: string }) {
    const ydocComments = getYdocComments()
    const threads = ydocComments?.get('articleThreads') as any[]
    ydocComments?.set(
      'articleThreads',
      threads?.filter((item) => item.id !== data.id),
    )
    return mutateResolveThread(data)
  }

  onResolveThreadDone(({ data }) => {
    const { id } = data?.resolveArticleThread || {}
    if (!id) return

    sendTrackUnchecked('comment_thread_resolved', {
      article_id: editorStore.id,
      thread_id: id,
    })
  })

  return {
    profile,
    async createThread({ content, position }: { content: string; position: { from: number; to: number } }) {
      if (!content) {
        return
      }

      const res = await mutateCreateThread({
        input: {
          article_id: editorStore.id,
          position: JSON.stringify(position),
        },
      })
      invariant(res?.data?.createArticleThread, 'createThread mutation failed')

      const ydocComments = getYdocComments()
      const articleThreads = ydocComments?.get('articleThreads') as Thread[]
      ydocComments?.set('articleThreads', [
        ...articleThreads,
        {
          id: res.data.createArticleThread.id,
          position,
          from: position.from,
          to: position.to,
          resolved: false,
          top: editorStore.editor?.storage.annotation.positions.find(
            (item) => item.id == res.data?.createArticleThread.id,
          ).top,
          notes: [
            {
              id: 'temp-id',
              author: {
                id: '1',
                name: meStore.me?.full_name,
                avatar: meStore.me?.avatar,
              },
              content,
              created_at: dayjs().toDateTimeString(),
            },
          ],
        },
      ])
      await replyThread({
        input: {
          thread_id: res.data.createArticleThread.id,
          content,
        },
      })
    },
    replyThread,
    editNote,
    removeNote,
    resolveThread,
  }
}

const DEFAULT_PENDING_THREAD_ID = 'opt-thread'

function extractPendingThreadId(position: string) {
  try {
    const { id } = JSON.parse(position)
    return id ? `opt-${id.replace('temp-', '')}` : DEFAULT_PENDING_THREAD_ID
  } catch {
    return 'opt-thread'
  }
}
