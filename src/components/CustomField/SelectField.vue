<script setup lang="ts">
import { sortBy } from 'remeda'
import { Select as SpSelect, SelectTypeahead as SpSelectTypeahead } from '@storipress/core-component'

interface SelectItem {
  display: string
  value: string | number | boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    label?: string
    htmlName: string
    placeholder?: string
    choices: Record<string, string>
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

const selectItems = computed(() => {
  const list = Object.keys(props.choices).map((key) => ({
    display: key,
    value: props.choices[key],
  }))
  return sortBy(list, (item) => item.display.toLowerCase())
})

const defaultValue = computed(() => {
  const set = new Set(props.modelValue)
  if (props.multiple) {
    return selectItems.value.filter((item) => set.has(item.value))
  } else {
    return selectItems.value.find((item) => set.has(item.value))
  }
})
</script>

<template>
  <SpSelectTypeahead
    v-if="multiple"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="selectItems"
    :model-value="undefined"
    :default-value="defaultValue"
    option-label-prop="display"
    @update:model-value="
      emit(
        'update:modelValue',
        $event.map((item: SelectItem) => item.value),
      )
    "
  />
  <SpSelect
    v-else
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="selectItems"
    :model-value="undefined"
    :default-value="defaultValue"
    option-label-prop="display"
    @update:model-value="emit('update:modelValue', [$event.value])"
  />
</template>

<style scoped></style>
