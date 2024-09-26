<script setup lang="ts">
import { Toggles as SpToggle } from '@storipress/core-component'

const props = defineProps<{
  label: string
  description: string | null
  modelValue: boolean
}>()
const emit = defineEmits<(event: 'update:modelValue', value: boolean) => void>()

const toggleVal = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="flex items-center gap-x-4">
    <SpToggle v-model="toggleVal" class="flex" />
    <div class="flex flex-col">
      <span class="text-body font-semibold text-stone-800">{{ label }}</span>
      <span class="text-caption text-stone-800">{{ description }}</span>
    </div>
  </div>
</template>

<style scoped></style>
