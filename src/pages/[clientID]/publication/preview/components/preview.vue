<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import StyleTreeRenderer from '~/components/Preview/style-tree-renderer.vue'
import type { StyleTree } from '~/lib/dynamic-style'

defineProps<{
  styleTree: StyleTree
}>()

const emit = defineEmits<(event: 'update:height', height: number) => void>()

const root = ref()

const { height } = useElementSize(root)

watch(height, (height) => {
  emit('update:height', height)
})
</script>

<template>
  <div ref="root">
    <slot />
    <StyleTreeRenderer :style-tree="styleTree" />
  </div>
</template>
