<script setup lang="ts">
import { Inputs as SpInput } from '@storipress/core-component'

const props = defineProps<{
  label: string
  modelValue: string
  htmlName: string
}>()
const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const colorVal = useVModel(props, 'modelValue', emit)
const colorPickerRef = ref()
onMounted(() => {
  if (!props.modelValue) {
    colorPickerRef.value.value = '#eab308'
  }
})
</script>

<template>
  <div class="relative">
    <SpInput v-model="colorVal" :label="label" html-type="text" :html-name="htmlName" placeholder="#123456" />
    <input
      ref="colorPickerRef"
      v-model="colorVal"
      class="color-picker absolute bottom-[4.5px] left-1 hover:cursor-pointer"
      type="color"
    />
  </div>
</template>

<style lang="scss" scoped>
.color-picker {
  @apply h-7 w-7 rounded-[3px] border-0 p-0;
}
.color-picker::-webkit-color-swatch {
  @apply rounded-[3px] border-0 p-0;
}
.color-picker::-webkit-color-swatch-wrapper {
  @apply rounded-[3px] border-0 p-0;
}
:deep .text-inputs {
  @apply pl-9;
}
</style>
