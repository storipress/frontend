<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { Icon } from '@storipress/core-component'
import { CardStatus } from './definition'

const props = defineProps<{
  status: CardStatus
  oldStage: string
  newStage: string
  newStageColor: string
}>()

const isPublished = computed(() => props.status === CardStatus.Published)
</script>

<template>
  <div
    class="layer-1 w-64 cursor-pointer rounded-sm border-sky-600 bg-sky-600/5 bg-white"
    :class="{ 'w-[33rem]': isPublished }"
  >
    <div class="flex items-center justify-center space-x-1.5" :class="isPublished ? 'py-3.5' : 'py-[2.5rem]'">
      <span class="text-body text-stone-600">{{ oldStage }}</span>
      <Icon class="text-stone-600" icon-name="arrow_right" />
      <span class="text-body font-medium uppercase" :style="{ color: newStageColor }">{{ newStage }}</span>
    </div>
  </div>
</template>

<style scoped></style>
