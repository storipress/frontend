<script setup lang="ts">
import { Select as SpSelect, SelectTypeahead as SpSelectTypeahead } from '@storipress/core-component'
import type { CustomFieldReferenceTargetValue, GetTagsQuery } from '~/graphql-operations'
import { GetTagsDocument } from '~/graphql-operations'

const props = withDefaults(
  defineProps<{
    modelValue: CustomFieldReferenceTargetValue[]
    label?: string
    htmlName: string
    placeholder?: string
    multiple?: boolean
  }>(),
  {
    modelValue: () => [],
    label: '',
    placeholder: '',
    multiple: false,
  },
)
const emit = defineEmits<(event: 'update:modelValue', value: string[]) => void>()

const { result } = useQuery<GetTagsQuery>(GetTagsDocument)
const tags = computed(() => {
  return result.value?.tags ?? []
})

const defaultValue = computed(() => {
  if (!props.modelValue) return undefined

  if (props.multiple) {
    return props.modelValue.filter((item) => item.__typename === 'Tag')
  } else {
    return props.modelValue.find((item) => item.__typename === 'Tag')
  }
})
</script>

<template>
  <SpSelectTypeahead
    v-if="multiple"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="tags"
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
    v-else-if="tags.length"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="tags"
    :model-value="undefined"
    :default-value="defaultValue"
    option-label-prop="name"
    @update:model-value="emit('update:modelValue', [$event.id])"
  />
</template>

<style scoped></style>
