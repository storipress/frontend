<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { DEFAULT_TEMPLATE, TEMPLATE_MAP } from '@article-templates/templates'
import StyleTreeRenderer from './style-tree-renderer.vue'
import type { StyleTree } from '~/lib/dynamic-style'

const props = defineProps<{
  templateName: string
  scope?: string
  styleTree: StyleTree

  // not used, just for convenience
  height?: number
}>()

const emit = defineEmits<(event: 'update:height', height: number) => void>()

const root = ref()

const Template = computed(() => {
  return TEMPLATE_MAP[props.templateName] || TEMPLATE_MAP[DEFAULT_TEMPLATE]
})

const { height } = useElementSize(root)

watch(height, (height) => {
  emit('update:height', height)
})
</script>

<template>
  <div ref="root" :class="scope">
    <div class="w-full bg-white">
      <component :is="Template" />
      <StyleTreeRenderer :style-tree="styleTree" :scope="scope" />
    </div>
  </div>
</template>
