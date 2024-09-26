<script lang="ts" setup>
import { defineEmits, defineExpose, defineProps, ref } from 'vue'
import { useFocus, useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  singleLine?: boolean
  name?: string
  rows?: string
}>()
const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const content = useVModel(props, 'modelValue', emit, { passive: true })

const textarea = ref<HTMLTextAreaElement>()
const { focused } = useFocus(textarea)

defineExpose({
  focus() {
    focused.value = true
  },
})

function onEnter(event: KeyboardEvent) {
  if (props.singleLine) {
    event.preventDefault()
  }
}
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-1">
    <div class="invisible col-start-1 col-end-2 row-start-1 whitespace-pre-wrap break-words">{{ `${content} ` }}</div>
    <textarea
      ref="textarea"
      v-model="content"
      :name="name"
      :aria-label="name"
      :placeholder="placeholder"
      :rows="rows"
      class="col-start-1 col-end-2 row-start-1 resize-none overflow-hidden focus:outline-none dark:group-[.has-dark]:bg-transparent dark:group-[.has-dark]:text-stone-200 dark:group-[.has-dark]:placeholder:text-stone-200/25"
      @keydown.enter="onEnter"
    />
  </div>
</template>
