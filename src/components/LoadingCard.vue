<script setup lang="ts">
import { ContentLoader } from 'vue-content-loader'

withDefaults(
  defineProps<{
    width: number
    height: number
    animate?: boolean
    primaryColor?: string
    primaryOpacity?: number
  }>(),
  {
    animate: true,
    primaryColor: 'white',
    primaryOpacity: 0.25,
  },
)
</script>

<template>
  <content-loader
    :width="width"
    :height="height"
    class="rounded-sm shadow-1-layer"
    :animate="animate"
    :primary-color="primaryColor"
    :primary-opacity="primaryOpacity"
    :viewBox="`0 0 ${width} ${height}`"
  >
    <rect x="0" y="0" rx="2" ry="2" :width="width" :height="height" />
  </content-loader>
</template>
