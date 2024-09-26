<script setup lang="ts">
import { LoadingSpinner, Select as SpSelect, SelectTypeahead as SpSelectTypeahead } from '@storipress/core-component'
import type { CustomFieldReferenceTargetValue } from '~/graphql-operations'
import { ListWebflowItemsDocument } from '~/graphql-operations'

const props = withDefaults(
  defineProps<{
    modelValue: CustomFieldReferenceTargetValue[]
    label?: string
    htmlName: string
    placeholder?: string
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

const isWebflowReference = computed(() => props.options.target === 'webflow' && Boolean(props.options.collection_id))

const { load, loading, result } = useLazyQuery(
  ListWebflowItemsDocument,
  computed(() => ({
    // set default value to suppress type error, default value should never use
    collection_id: props.options.collection_id ?? '',
  })),
  {
    enabled: isWebflowReference,
  },
)

whenever(
  isWebflowReference,
  () => {
    load()
  },
  { immediate: true },
)

const referenceItems = computed(() => {
  return result.value?.webflowItems ?? []
})

const defaultValue = computed(() => {
  if (loading.value) return undefined
  if (!props.modelValue) return undefined

  const referenceIds = new Set(props.modelValue.map((reference) => reference.id))

  if (props.multiple) {
    return referenceItems.value.filter((item) => referenceIds.has(item.id))
  } else {
    return referenceItems.value.find((item) => referenceIds.has(item.id))
  }
})
</script>

<template>
  <div v-if="loading">
    <label class="text-body block text-stone-800">{{ label }}</label>
    <LoadingSpinner show spin-width="w-5" />
  </div>
  <SpSelectTypeahead
    v-else-if="multiple"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="referenceItems"
    :model-value="undefined"
    :default-value="defaultValue as CustomFieldReferenceTargetValue[]"
    unique-key="id"
    option-label-prop="name"
    @update:model-value="
      emit(
        'update:modelValue',
        $event.map((item: CustomFieldReferenceTargetValue) => item.id),
      )
    "
  />
  <SpSelect
    v-else-if="referenceItems.length"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="referenceItems"
    :model-value="undefined"
    :default-value="defaultValue"
    option-label-prop="name"
    @update:model-value="emit('update:modelValue', [$event.id])"
  />
</template>
