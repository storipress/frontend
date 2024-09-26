import type { Ref } from 'vue'
import { computed, toRef, unref } from 'vue'
import type { MaybeRef } from '@vueuse/core'
import { computedEager } from '@vueuse/core'
import type { Editor } from '@tiptap/core'
import { captureException } from '@sentry/vue'
import type { Note, RawNote, RawThread, RawUser, Thread, User } from './definitions'
import { dayjs } from '~/lib/dayjs'
import type { ListThreadsQuery } from '~/graphql-operations'
import { ListThreadsDocument } from '~/graphql-operations'
import { getAvatarURL } from '~/lib/avatar'
import { useDebugLog } from '~/composables'

export function normalizeThread(thread: RawThread): Thread {
  return {
    ...thread,
    notes: thread.notes.map(normalizeNote),
    // skipcq: JS-0050
    resolved: thread.resolved_at != null,
    resolvedAt: thread.resolved_at && dayjs(thread.resolved_at),
  }
}

export function normalizeNote(note: RawNote): Note {
  return {
    ...note,
    author: normalizeUser(note.user),
    createdAt: dayjs(note.created_at),
  }
}

function normalizeUser(user: RawUser): User {
  return {
    ...user,
    name: user.full_name ?? '',
    avatar: user.avatar ?? getAvatarURL(user.full_name),
  }
}

export function useThreads(id: MaybeRef<string>, options: Record<string, unknown> = {}): Readonly<Ref<Thread[]>> {
  const { result } = useQuery(
    ListThreadsDocument,
    computed(() => ({ id: unref(id) })),
    options,
  )

  return computed(() => {
    if (!result.value) {
      return []
    }

    const { article } = result.value
    if (!article) {
      return []
    }

    return article.threads.map((thread) => normalizeThread(thread))
  })
}

interface UseListThreadsInput {
  id: string
  editor: Editor
}

export function useListThreads(props: UseListThreadsInput): Readonly<Ref<Thread[]>> {
  useDebugLog('list-threads')
  const id = toRef(props, 'id')
  const { result } = useQuery(
    ListThreadsDocument,
    computed(() => ({ id: unref(id) })),
  )

  return toNormalizedThreads(result)
}

function toNormalizedThreads(result: Ref<ListThreadsQuery | undefined>) {
  const debug = useDebugLog('list-threads')

  return computedEager((): Thread[] => {
    debug('threads update')
    if (!result.value?.article?.threads) {
      const article = result.value?.article
      if (article && !Array.isArray(article.threads)) {
        captureException(new Error('Invalid threads data'), (scope) => {
          scope.setContext('article', {
            article,
          })
          return scope
        })
      }

      return []
    }

    return result.value.article.threads.map(
      ({ id, notes, position, resolved_at }): Thread => ({
        id,
        resolved: Boolean(resolved_at),
        position: JSON.parse(position),
        notes: notes.map(({ id, user, content, created_at }) => ({
          id,
          author: {
            ...user,
            name: user.full_name ?? '',
            avatar: user.avatar || getAvatarURL(user.full_name),
          },
          content,
          created_at,
          createdAt: dayjs(created_at),
        })),
      }),
    )
  })
}
