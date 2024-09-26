<script setup lang="ts">
import { mergeTailwind } from '@storipress/core-component'
import { ContentLoader } from 'vue-content-loader'

withDefaults(
  defineProps<{
    animate?: boolean
    primaryColor?: string
    primaryOpacity?: number
    secondaryColor?: string
    secondaryOpacity?: number
  }>(),
  {
    animate: true,
    primaryColor: '#fefefe',
    primaryOpacity: 0.1,
    secondaryColor: '#fefefe',
    secondaryOpacity: 1,
  },
)
</script>

<template>
  <content-loader
    :class="mergeTailwind(['rounded-sm border border-solid border-gray-100', $attrs.class])"
    :animate="animate"
    :primary-color="primaryColor"
    :primary-opacity="primaryOpacity"
    :secondary-color="secondaryColor"
    :secondary-opacity="secondaryOpacity"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    :speed="2 * Math.random() + 1"
  >
    <rect x="0" y="0" rx="2" ry="2" width="100%" height="100%" />
  </content-loader>
</template>

<style lang="scss" scoped></style>
