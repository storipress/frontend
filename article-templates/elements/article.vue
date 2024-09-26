<script lang="ts" setup>
import ColorArea from './color-area.vue'

const props = defineProps({
  backgroundColor: {
    type: [Boolean, String, Object],
    default: 'ffffff',
  },
})

const color = computed(() => {
  const { backgroundColor: color } = props
  return color ? (color === true ? 'ffffff' : color) : undefined
})
</script>

<template>
  <ColorArea class="article pb-20" component="article" :background-color="color">
    <slot />
  </ColorArea>
</template>
