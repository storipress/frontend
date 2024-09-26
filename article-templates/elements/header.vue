<script lang="ts" setup>
import ColorArea from './color-area.vue'

const props = defineProps({
  backgroundColor: [Boolean, String],
})

const color = computed(() => {
  const { backgroundColor: color } = props
  return color ? (color === true ? '#ffffff' : (color as string)) : null
})
</script>

<template>
  <ColorArea component="section" kind="article-header" :disabled="!color" :background-color="color">
    <slot />
  </ColorArea>
</template>
