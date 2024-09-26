<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { defineProps, ref } from 'vue'
import { useArticleElement } from './inject'
import { RichInput } from '~/components/Editor/rich-input'
import { useInjectYDoc } from '~/composables/context'

const props = defineProps<{
  field: 'title' | 'blurb' | 'headlineCaption'
  placeholder?: string
}>()
const ydoc = useInjectYDoc()
const element = useArticleElement()
const value = ref(normalize(element[props.field]))

watch(
  () => element[props.field],
  () => {
    value.value = normalize(element[props.field])
  },
)

function normalize(value?: string) {
  if (!value) {
    return ''
  }

  if (value.startsWith('<p>') && value.endsWith('</p>')) {
    return value
  }
  return `<p>${value}</p>`
}

const updateArticle = debounce((val: string) => {
  element[props.field] = val
}, 1000)
</script>

<template>
  <RichInput
    :model-value="field === 'headlineCaption' ? value : undefined"
    class="custom-placeHolder"
    :field-name="field"
    :ydoc="ydoc"
    :placeholder="placeholder"
    @update:model-value="updateArticle($event)"
  />
</template>

<style lang="scss" scoped>
.custom-placeHolder :deep(.is-editor-empty) {
  @apply text-stone-400;
}
</style>
