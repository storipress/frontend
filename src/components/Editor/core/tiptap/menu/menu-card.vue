<!-- menu parent -->
<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import type { Component } from 'vue'
import type { ActionableFormat } from './definitions'
import TextMenu from './text-menu.vue'

defineProps<{
  editor?: Editor
  activeBlock: string
  nodeState: Record<string, boolean>
  isEmptySelection?: boolean
  dialog: Component | null
}>()

const emit = defineEmits<(event: 'applyFormat', format: ActionableFormat) => void>()

const menu = ref<{ focus?: () => void }>()

function applyFormat(format: ActionableFormat) {
  emit('applyFormat', format)

  // intercept the link format
  const isLinkClick = format.type === 'state' && format.state === 'link'
  if (isLinkClick) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        menu.value?.focus?.()
      })
    })
  }
}
</script>

<template>
  <div class="has-dark layer-2 flex h-8 w-fit rounded bg-white dark:bg-stone-800" @click.stop>
    <TextMenu
      v-if="!isEmptySelection"
      :active-block="activeBlock"
      :node-state="nodeState"
      @apply-format="applyFormat"
    />
    <component
      :is="dialog"
      v-if="dialog"
      ref="menu"
      :class="!isEmptySelection && 'absolute left-0 mt-16'"
      :editor="editor"
      :active-block="activeBlock"
      :node-state="nodeState"
      @apply-format="applyFormat"
    />
  </div>
</template>
