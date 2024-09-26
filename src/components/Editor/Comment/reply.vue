<!-- reply box -->

<!-- Template for the reply box -->
<script lang="ts" setup>
// Importing necessary components and types
import { AutoSizeTextarea } from '../../Shared'
import { separatedLine } from './definitions'
import type { User } from './definitions'

// Defining props with default values
const props = withDefaults(
  defineProps<{
    id?: string
    autoFocus?: boolean
    profile: User
  }>(),
  {
    autoFocus: false,
  },
)

// Defining emitted events
const emit = defineEmits<{
  (event: 'submit', value: { id?: string; content: string }): void
  (event: 'cancel'): void
}>()

// Defining reactive variables
const content = ref('')
const suggest = ref('')
const input = ref<{ focus: () => void }>()

// Focus on the textarea when the component is mounted
onMounted(() => {
  if (props.autoFocus) {
    requestAnimationFrame(() => {
      input.value?.focus()
    })
  }
})

// Function to handle the submit event
function handleSubmit(event: KeyboardEvent) {
  if (event.shiftKey) {
    return
  }
  event.preventDefault()
  emit('submit', { id: props.id, content: content.value + separatedLine + suggest.value })
  content.value = ''
  suggest.value = ''
}
</script>

<!-- Script for the reply box -->
<template>
  <!-- Section for the reply box with styling -->
  <section class="mt-4 flex items-start gap-3 rounded-md border border-sky-600 px-4 py-2">
    <!-- User avatar -->
    <img class="size-6 rounded-full" :src="profile.avatar" :alt="profile.name" />

    <!-- Textarea for user to input their reply -->
    <div class="flex w-full flex-col space-y-2 [&_textarea]:bg-transparent">
      <AutoSizeTextarea
        ref="input"
        v-model="content"
        type="textarea"
        class="has-dark group text-body w-full placeholder:text-stone-400"
        rows="1"
        placeholder="Add a comment..."
        @keydown.enter="handleSubmit"
        @keydown.esc="$emit('cancel')"
        @blur="$emit('cancel')"
      />

      <AutoSizeTextarea
        v-model="suggest"
        type="textarea"
        class="has-dark group text-body placeholder:text-stone-400"
        rows="1"
        placeholder="Suggest change..."
        @keydown.enter="handleSubmit"
        @keydown.esc="$emit('cancel')"
        @blur="$emit('cancel')"
      />
    </div>
  </section>
</template>
