<script setup lang="ts">
import DeskSelect from './components/DeskSelect.vue'
import TagSelect from './components/TagSelect.vue'
import UserSelect from './components/UserSelect.vue'
import ArticleSelect from './components/ArticleSelect.vue'
import WebflowReferenceSelect from './components/WebflowReferenceSelect.vue'
import { CustomFieldReferenceTarget } from '~/graphql-operations'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    label?: string
    htmlName: string
    placeholder?: string
    target: CustomFieldReferenceTarget
    multiple?: boolean
    options: { target: string; collection_id?: string }
  }>(),
  {
    modelValue: () => [],
    label: '',
    placeholder: '',
    multiple: false,
  },
)
const emit = defineEmits<(event: 'update:modelValue', value: string[]) => void>()

const target = toRef(props, 'target')
const component: Record<CustomFieldReferenceTarget, Component> = {
  [CustomFieldReferenceTarget.Article]: ArticleSelect,
  [CustomFieldReferenceTarget.Desk]: DeskSelect,
  [CustomFieldReferenceTarget.Tag]: TagSelect,
  [CustomFieldReferenceTarget.User]: UserSelect,
  [CustomFieldReferenceTarget.Webflow]: WebflowReferenceSelect,
}
</script>

<template>
  <component
    :is="component[target]"
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :multiple="multiple"
    :html-name="htmlName"
    :options="options"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
