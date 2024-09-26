<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import type { Editor } from '@tiptap/core'
import { hideSlashAndAIMenu } from '~/components/Editor/utils'

const props = withDefaults(
  defineProps<{
    editor: Editor
    hasPrompt?: boolean
    placeholder?: string
    command: (props: any) => void
  }>(),
  {
    hasPrompt: true,
    placeholder: 'Ask Storipress AI to write anything...',
  },
)

defineEmits<{ keydown: [KeyboardEvent] }>()

const userPrompt = defineModel<string>('modelValue', { default: '' })

const input = ref<HTMLInputElement>()
const searchLock = ref(false)

defineExpose({
  focus: () => {
    if (!hideSlashAndAIMenu(props.editor)) {
      input.value?.focus({ preventScroll: true })
    }
  },
})
</script>

<template>
  <div v-show="!hideSlashAndAIMenu(editor)" class="relative z-10 -ml-1 mt-2 flex flex-col gap-0.5">
    <div class="layer-2 w-full rounded bg-white px-4 py-2.5">
      <div v-if="hasPrompt" class="text-body flex items-center justify-center space-x-3">
        <Icon class="text-[.75rem] text-sky-700" icon-name="magic" />
        <input
          ref="input"
          v-model="userPrompt"
          name="prompt"
          class="w-full bg-transparent focus:outline-none"
          :placeholder="placeholder"
          @keydown="
            ($event) => {
              if (!searchLock) $emit('keydown', $event)
            }
          "
          @compositionstart="searchLock = true"
          @compositionend="searchLock = false"
        />
        <Icon
          class="cursor-pointer text-[1rem] text-stone-500 transition-colors hover:text-stone-600"
          icon-name="circle-tick"
          @click="command({ prompt: userPrompt || '' })"
        />
      </div>
      <slot v-else name="prompt" />
    </div>
    <slot />
  </div>
</template>
