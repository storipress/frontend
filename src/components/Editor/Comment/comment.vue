<!-- parent of header + comment -->

<script lang="ts" setup>
import { Buttons } from '@storipress/core-component'
import { AutoSizeTextarea } from '../../Shared'
import type { Note, User } from './definitions'
import { separatedLine } from './definitions'
import CommentHeader from './comment-header.vue'
import { useSentryFlagStore } from '~/stores/sentry-flag'
import { dayjs } from '~/lib/dayjs'

const props = withDefaults(
  defineProps<{
    comment: Note
    profile: User
    showResolve?: boolean
    loading?: boolean
    threadId: string
  }>(),
  {
    showResolve: false,
    loading: false,
  },
)

const emit = defineEmits<{
  (event: 'resolve'): void
  (event: 'suggest', payload: { content: string }): void
  (event: 'edit', payload: { id: string; content: string }): void
  (event: 'remove', payload: { id: string }): void
}>()

const sentryFlagStore = useSentryFlagStore()
const editing = ref(false)
const content = ref('')
const suggest = ref('')
const hasSuggest = ref(false)
const input = ref<{ focus: () => void }>()

const time = computed(() => dayjs(props.comment.created_at).toISOString())

const displayTime = computed(() => dayjs(props.comment.created_at).toDisplayString())

const showMore = computed(() => props.comment.author.id === props.profile.id)
const isComposition = ref(false)

onMounted(() => {
  const splitString = props.comment.content.split(separatedLine)
  content.value = splitString[0]
  suggest.value = splitString[1]
  if (suggest.value) {
    hasSuggest.value = true
  }
})

function handleEdit() {
  editing.value = true
  requestAnimationFrame(() => {
    input.value?.focus()
  })
}

function handleSubmit(event: KeyboardEvent) {
  if (event.shiftKey || isComposition.value) {
    return
  }
  editing.value = false
  emit('edit', { id: props.comment.id, content: content.value + separatedLine + suggest.value })
}

function handleResolve() {
  sentryFlagStore.SET_DELETED_COMMENT_ID(props.threadId)
  emit('resolve')
}

function handleSuggest() {
  emit('suggest', { content: suggest.value })
}

function handleRemove() {
  emit('remove', { id: props.comment.id })
}
</script>

<template>
  <section>
    <CommentHeader
      :profile="comment.author"
      :time="time"
      :display-time="displayTime"
      :show-resolve="showResolve"
      :show-more="showMore"
      :loading="loading"
      @resolve="handleResolve"
      @edit="handleEdit"
      @remove="handleRemove"
    />

    <div class="mb-3 w-full break-words [&_textarea]:bg-transparent">
      <AutoSizeTextarea
        v-if="editing"
        ref="input"
        v-model="content"
        type="textarea"
        class="has-dark group text-body mx-2 mb-3 rounded-lg border border-sky-600 px-2 py-1 placeholder:text-stone-400"
        @keydown.enter.exact="handleSubmit"
        @compositionstart="isComposition = true"
        @compositionend="isComposition = false"
      />

      <article v-else class="text-body mx-4 whitespace-pre-line text-stone-800 dark:text-stone-200" v-text="content" />
    </div>

    <div
      v-if="hasSuggest"
      class="layer-1 mx-auto flex w-[90%] flex-col space-y-2 break-words rounded-md bg-stone-100 p-2 dark:bg-stone-700 [&_textarea]:bg-transparent"
    >
      <div class="text-subheading ml-1 dark:text-stone-100">Suggested change</div>
      <AutoSizeTextarea
        v-if="editing"
        ref="input"
        v-model="suggest"
        type="textarea"
        class="has-dark group text-body mx-2 rounded-lg border border-sky-600 px-2 py-1 placeholder:text-stone-400"
        @keydown.enter.exact="handleSubmit"
        @compositionstart="isComposition = true"
        @compositionend="isComposition = false"
      />
      <article v-else class="text-body mx-1 whitespace-pre-line text-stone-800 dark:text-stone-200" v-text="suggest" />
      <Buttons @click="handleSuggest">Apply change</Buttons>
    </div>
  </section>
</template>
