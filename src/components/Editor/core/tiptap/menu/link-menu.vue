<script lang="ts" setup>
import { defineEmits, defineExpose, defineProps, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { getMarkAttributes } from '@tiptap/vue-3'
import { isWebUri } from 'valid-url'
import type { ActionableFormat } from './definitions'
import MenuLink from '~/components/Manager/MenuLink'

const props = defineProps<{
  editor?: Editor
  activeBlock: string
  nodeState: Record<string, boolean>
}>()
const emit = defineEmits<(event: 'applyFormat', format: ActionableFormat) => void>()

const menu = ref<{ focus: () => void }>()
const link = ref<string>('')

defineExpose({
  focus: () => {
    menu.value?.focus()
  },
})

// resolve the original link
if (props.editor) {
  const attrs = getMarkAttributes(props.editor.state, 'link')
  link.value = attrs?.href || ''
}

function handleChange() {
  const rawLink = link.value
  const normalizedURL = rawLink.startsWith('http') ? rawLink : `https://${rawLink}`
  if (isWebUri(normalizedURL)) {
    emit('applyFormat', {
      type: 'action',
      key: 'link',
      action: 'setLink',
      options: {
        href: normalizedURL,
      },
    })
  }
}

function handleDelete() {
  emit('applyFormat', {
    type: 'action',
    key: 'link',
    action: 'unsetLink',
  })
}
</script>

<template>
  <MenuLink ref="menu" v-model="link" @change="handleChange" @delete="handleDelete" />
</template>
