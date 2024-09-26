<script lang="ts" setup>
import { Icon, LoadingSpinner } from '@storipress/core-component'
import type { GeneratingKey } from '../utils/store'

const props = defineProps<{
  promptType: string
  colName: GeneratingKey
  generating: boolean
}>()

const emits = defineEmits<{
  (event: 'generateResponse', promptType: string, colName: GeneratingKey): void
}>()

function clickButton(promptType: string, colName: GeneratingKey) {
  if (!props.generating) {
    emits('generateResponse', promptType, colName)
  }
}
</script>

<template>
  <div role="button" @click="clickButton(promptType, colName)">
    <LoadingSpinner v-if="generating" show class="flex w-3 items-center" />
    <Icon v-else icon-name="magic" class="text-xs text-sky-700" />
  </div>
</template>
