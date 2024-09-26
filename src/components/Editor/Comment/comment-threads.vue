<!-- not used in storybook, component to connect comment threads API -->

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import { computed, ref, toRef } from 'vue'
import { captureException } from '@sentry/vue'
import invariant from 'tiny-invariant'
import type * as Y from 'yjs'
import type { Editor } from '@tiptap/vue-3'
import type { RemoveCommentParam } from '../core'
import type { Thread, User } from './definitions'
import CommentThread from './comment-thread.vue'
import { useListThreads } from './helpers'
import { useBindCommentAndAnnotation } from './editor-comment-bridge'
import { useCommentAPI } from '~/composables'
import { useComment } from '~/stores/comment'
import type { Pos } from '~/components/Editor/core/types'

const props = defineProps<{
  id: string
  profile: User
  editor: Editor
  ydoc: Y.Doc
}>()

const { editNote, removeNote, replyThread, resolveThread } = useCommentAPI(
  computed(() => ({
    ...props.profile,
    full_name: props.profile.name,
  })),
)

const ydocComments = props.ydoc.getMap('comments')
const store = useComment()

const allTransform = ref<string[]>([])
const threadRefs = ref<ComponentPublicInstance[]>([])
const threadTopMap = toRef(store, 'threadTopMap')
const showThreads = ref<Thread[]>([])
const apiThreads = useListThreads(props)

const { doResolveThread } = useBindCommentAndAnnotation(props, apiThreads, resolveThread)

watchOnce(apiThreads, (nowValues) => {
  const threadTop = threadTopMap.value
  const threads = nowValues.map(({ id, position, ...rest }: Thread) => {
    return {
      id,
      position,
      from: position.from,
      ...rest,
      top: threadTop[id],
    }
  })
  ydocComments.set('articleThreads', threads)
})

ydocComments.observe(async (event) => {
  const threadTop = threadTopMap.value
  const comments = event.target.toJSON()

  if (!comments?.articleThreads) {
    captureException(new Error('article threads is undefined'))
  }

  showThreads.value =
    (comments.articleThreads as Thread[])?.map(({ id, position, top, ...rest }) => {
      return { id, position, from: position.from, ...rest, top: top || threadTop[id] }
    }) ?? []

  await nextTick()
  positionComments()
})

// sometimes threadTop doesn't updated when comments changed, need manually update top
watch(
  threadTopMap,
  (nowTops) => {
    showThreads.value = (showThreads.value as Thread[]).map((item) => {
      return {
        ...item,
        top: nowTops[item.id],
      }
    })
  },
  { deep: true },
)

watch(
  () => store.threadTop,
  async () => {
    positionComments()
  },
)

watchDebounced(
  allTransform,
  (allTransform) => {
    const threadComponents = threadRefs.value ?? []
    const $threads = threadComponents.map(({ $el }) => $el) as HTMLElement[]
    const threadElementMap = Object.fromEntries(
      $threads.map(($el) => {
        return [$el.dataset.id, $el]
      }),
    )

    const threads = store.threadTop
      .map(({ id, top }) => {
        const $el = threadElementMap[id]
        if (!$el) {
          return null
        }
        return {
          id,
          top,
          $el,
          rect: $el.getBoundingClientRect(),
        }
      })
      .filter((x): x is { id: string; top: number; $el: HTMLElement; rect: ClientRect } => x != null)

    for (let i = 0; i < threads.length; ++i) {
      threads[i].$el.style.transform = allTransform[i]
    }
  },
  { deep: true, debounce: 100 },
)

function handleResolve(data: { id: string }) {
  doResolveThread(data)
}

function handleEdit(input: { id: string; content: string }, thread: Thread) {
  editNote(input, thread)
}

function handleRemove(param: RemoveCommentParam, thread: any) {
  removeNote(param, thread)
}

function handleSubmit({ id, content }: { id?: string; content: string }) {
  invariant(id != null, 'id is required')
  if (!content) {
    return
  }

  replyThread({ input: { thread_id: id, content } })
}

function handleSuggest(suggestContent: string, data: { id: string; position: Pos }) {
  const { position } = data
  props.editor
    .chain()
    .deleteRange({ from: position.from, to: position.to })
    .insertContentAt(position.from, suggestContent)
    .run()
  doResolveThread(data)
}

function positionComments() {
  const threadComponents = threadRefs.value ?? []
  if (threadComponents.length === 0) {
    return
  }

  const $threads = threadComponents.map(({ $el }) => $el) as HTMLElement[]
  const threadElementMap = Object.fromEntries(
    $threads.map(($el) => {
      return [$el.dataset.id, $el]
    }),
  )

  const threads = store.threadTop
    .map(({ id, top }) => {
      const $el = threadElementMap[id]
      if (!$el) {
        return null
      }
      return {
        id,
        top,
        $el,
        rect: $el.getBoundingClientRect(),
      }
    })
    .filter((x): x is { id: string; top: number; $el: HTMLElement; rect: ClientRect } => x != null)

  if (threads.length === 0) return

  let prevTop = threads[0].top
  threads[0].$el.style.top = `calc(${prevTop}px + var(--editor-top, 0px))`
  // HACK: $forceUpdate is not working in this component
  for (let i = 1; i < threads.length; ++i) {
    const top = Math.max(prevTop + threads[i - 1].rect.height + 5, threads[i].top)
    const { $el } = threads[i]
    $el.style.top = `calc(${top}px + var(--editor-top, 0px))`
    prevTop = top
  }

  for (let i = 0; i < threads.length; ++i) {
    threads[i].$el.style.transition = 'transform 0.3s ease-out'
  }

  if (store.selectedThreadId) {
    function slightlyMoveTarget(targetIndex: number) {
      for (let i = 0; i < threads.length; ++i) {
        if (targetIndex > i) {
          allTransform.value[i] = 'translateY(-16px)'
        } else if (targetIndex < i) {
          allTransform.value[i] = 'translateY(64px)'
        }
      }
      allTransform.value[targetIndex] = 'translate(-10%, -12px)'
    }

    const targetIndex = threads.findIndex((x) => x.id === store.selectedThreadId)
    let startIndex = 0
    // First thread
    if (targetIndex === 0) {
      allTransform.value[0] = 'translate(-10%, -12px)'
      for (let i = 1; i < threads.length; ++i) {
        allTransform.value[i] = ''
      }
      return
    }

    for (let i = 0; i < threads.length; ++i) {
      allTransform.value[i] = ''
    }

    // 找到距離 targetIndex 最近的一個 top 距離大於 200 的 thread
    // 200 為兩行的距離, 如果中間有空出兩行才可能留白
    // 從留白開始的 index 計算高度
    threads.slice(0, targetIndex + 1).forEach((_, index) => {
      const diffTop = threads[index].top - threads[index - 1 > 0 ? index - 1 : 0].top
      if (diffTop > 200) {
        const prevHeight = threads
          .slice(0, index)
          .reduce(
            (acc, item, index) => acc + item.rect.height - (item.top - threads[index - 1 > 0 ? index - 1 : 0].top),
            0,
          )

        if (prevHeight < diffTop) {
          startIndex = index
        }
      }
    })

    if (startIndex === targetIndex) {
      slightlyMoveTarget(targetIndex)
      return
    }

    let prevTop = threads[startIndex].top
    let maxTop =
      threads.slice(startIndex, targetIndex).reduce((acc, { rect, top }) => {
        const diff = top - prevTop
        prevTop = top
        return acc + rect.height - diff
      }, 0) -
      (threads[targetIndex].top - threads[targetIndex - 1 > 0 ? targetIndex - 1 : 0].top) +
      32 +
      5 * (targetIndex - 1)

    // 如果右邊的 comment 中間有空白，則需要將所差距之空白補上
    // 如果累加後高度不足，則將差距補上

    let diffTop = 0
    for (let i = startIndex + 1; i < targetIndex; ++i) {
      diffTop += threads[i].top - threads[i - 1].top - threads[i - 1].rect.height
    }

    if (diffTop > 0) {
      maxTop += diffTop
    }

    for (let i = 0; i < threads.length; ++i) {
      if (targetIndex > i) {
        allTransform.value[i] = `translateY(-${maxTop}px)`
      } else if (targetIndex < i) {
        allTransform.value[i] = `translateY(-${Math.abs(maxTop - 128)}px)`
      } else {
        allTransform.value[i] = `translate(-10%, calc(-${maxTop}px + 1rem))`
      }
    }
  } else {
    for (let i = 0; i < threads.length; ++i) {
      allTransform.value[i] = ''
    }
  }
}
</script>

<template>
  <div>
    <template v-for="thread of showThreads">
      <CommentThread
        v-if="thread.top != null"
        :key="thread.id"
        ref="threadRefs"
        class="absolute"
        :editor="editor"
        :thread="thread"
        :profile="profile"
        :data-top="thread.top"
        :data-from="thread.from"
        :notes="thread.notes"
        @resolve="handleResolve"
        @suggest="handleSuggest"
        @edit="handleEdit"
        @remove="handleRemove"
        @submit="handleSubmit"
        @position-comments="positionComments"
      />
    </template>
  </div>
</template>
