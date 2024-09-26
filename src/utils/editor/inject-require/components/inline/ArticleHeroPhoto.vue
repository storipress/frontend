<script lang="ts" setup>
defineProps<{
  src: string
  width: string | number
  height: string | number
  quality?: number | string
  sizes?: string
}>()
</script>

<template>
  <img :src="src" :width="width" :height="height" :sizes="sizes" />
</template>
