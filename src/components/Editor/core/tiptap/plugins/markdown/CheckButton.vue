<script lang="ts" setup>
import { Buttons, Icon } from '@storipress/core-component'

const props = defineProps<{
  clickFn: () => void
  mountFn: (mounted: boolean) => void
}>()

onMounted(() => {
  props.mountFn(true)
})

onUnmounted(() => {
  props.mountFn(false)
})
</script>

<template>
  <div class="layer-2 rounded border border-gray-100 bg-white">
    <Buttons @click="clickFn"><Icon icon-name="undo" class="mr-1" />Remove format</Buttons>
  </div>
</template>
