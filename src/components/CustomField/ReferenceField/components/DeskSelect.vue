<script setup lang="ts">
import { Select as SpSelect, SelectTypeahead as SpSelectTypeahead } from '@storipress/core-component'
import { cloneDeep } from 'lodash-es'
import type { CustomFieldReferenceTargetValue, ListDesksQuery } from '~/graphql-operations'
import { ListDesksDocument } from '~/graphql-operations'

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

const { result } = useQuery<ListDesksQuery>(ListDesksDocument)
const desks = computed(() => {
  const list = result.value?.desks?.flatMap((desk) => {
    const subDesk = desk.desks ?? []
    return [desk, ...subDesk]
  })

  return cloneDeep(list) ?? []
})

const defaultValue = computed(() => {
  if (!props.modelValue) return undefined

  if (props.multiple) {
    return props.modelValue.filter((item) => item.__typename === 'Desk')
  } else {
    return props.modelValue.find((item) => item.__typename === 'Desk')
  }
})
</script>

<template>
  <SpSelectTypeahead
    v-if="multiple"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="desks"
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
    v-else-if="desks.length"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="desks"
    :model-value="undefined"
    :default-value="defaultValue"
    option-label-prop="name"
    @update:model-value="emit('update:modelValue', [$event.id])"
  />
</template>

<style scoped></style>
