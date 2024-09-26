<script setup lang="ts">
import { Select as SpSelect, SelectTypeahead as SpSelectTypeahead } from '@storipress/core-component'
import type { CustomFieldReferenceTargetValue, ListSimpleUsersQuery } from '~/graphql-operations'
import { ListSimpleUsersDocument } from '~/graphql-operations'

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

const { result } = useQuery<ListSimpleUsersQuery>(ListSimpleUsersDocument)
const users = computed(
  () =>
    result.value?.users.map((user) => ({
      id: user.id,
      full_name: user.full_name,
    })) ?? [],
)

const defaultValue = computed(() => {
  if (!props.modelValue) return undefined

  if (props.multiple) {
    return props.modelValue.filter((item) => item.__typename === 'User')
  } else {
    return props.modelValue.find((item) => item.__typename === 'User')
  }
})
</script>

<template>
  <SpSelectTypeahead
    v-if="multiple"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="users"
    :model-value="undefined"
    :default-value="defaultValue as CustomFieldReferenceTargetValue[]"
    unique-key="id"
    option-label-prop="full_name"
    @update:model-value="
      emit(
        'update:modelValue',
        $event.map((item: CustomFieldReferenceTargetValue) => item.id),
      )
    "
  />
  <SpSelect
    v-else-if="users.length"
    :label="label"
    :placeholder="placeholder"
    :name="htmlName"
    :items="users"
    :model-value="undefined"
    :default-value="defaultValue"
    option-label-prop="full_name"
    @update:model-value="emit('update:modelValue', [$event.id])"
  />
</template>

<style scoped></style>
