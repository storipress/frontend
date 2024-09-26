<script lang="ts" setup>
import { computed, defineProps } from 'vue'

const props = defineProps<{
  title?: string
  width: number
  height: number
  interactive?: boolean
}>()

const viewBox = computed(() => {
  return `0 0 ${props.width} ${props.height}`
})
</script>

<template>
  <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg" data-marpit-svg="">
    <title v-if="title">{{ title }}</title>
    <foreignObject x="0" y="0" :width="`${width}`" :height="`${height}`">
      <section xmlns="http://www.w3.org/1999/xhtml" class="relative h-full" :class="!interactive && 'select-none'">
        <slot />
        <div v-if="!interactive" class="absolute inset-0 size-full" v-on="$attrs" />
      </section>
    </foreignObject>
  </svg>
</template>
