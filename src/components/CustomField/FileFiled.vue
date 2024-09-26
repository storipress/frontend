<script setup lang="ts">
import { Buttons as SpButton } from '@storipress/core-component'
import type { CustomFieldFileValueAttributes } from '~/graphql-operations'

const props = defineProps<{
  label: string
  modelValue: CustomFieldFileValueAttributes
  isLoading: boolean
}>()
const emit = defineEmits<(event: 'update:modelValue', value: File) => void>()

const fileName = ref('')
const uploadFileRef = ref()
function uploadFile(e: Event) {
  const $el = e.target as HTMLInputElement
  const file = $el.files?.[0] as File
  if (!file) return

  fileName.value = file.name
  emit('update:modelValue', file)
}

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      fileName.value = ''
      uploadFileRef.value = null
    }
  },
)
</script>

<template>
  <div>
    <div class="text-subheading mb-4 text-stone-800">Upload {{ label }}</div>
    <div class="flex items-center gap-2">
      <input ref="uploadFileRef" :key="`file_${fileName}`" type="file" class="hidden" @change="uploadFile" />
      <SpButton
        is-border
        is-shadow
        :disabled="Boolean(modelValue)"
        :is-loading="Boolean(modelValue) && isLoading"
        class="text-button text-stone-800"
        @click="uploadFileRef.click()"
      >
        Upload
      </SpButton>
      <span class="text-body text-stone-800">{{ modelValue?.mime_type || fileName }}</span>
    </div>
  </div>
</template>

<style scoped></style>
