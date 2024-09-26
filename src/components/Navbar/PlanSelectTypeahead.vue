<script lang="ts" setup>
import { Icon, SelectTypeahead } from '@storipress/core-component'
import type { PlanItem } from './definition'
import { ArticlePlan } from '~/graphql-operations'

withDefaults(
  defineProps<{
    modelValue: PlanItem[]
    placeholder?: string
  }>(),
  {
    modelValue: () => [],
    placeholder: 'Plans',
  },
)
defineEmits<(event: 'update:modelValue', value: PlanItem[]) => void>()

const plans: PlanItem[] = [
  { label: 'Free access', key: ArticlePlan.Free },
  { label: 'Members only', key: ArticlePlan.Member },
  { label: 'Subscribers only', key: ArticlePlan.Subscriber },
]
</script>

<template>
  <div class="mb-2 flex w-full items-center">
    <Icon class="ml-[0.125rem] mr-[0.625rem] size-4 text-[1rem] text-white" icon-name="preview" />

    <SelectTypeahead
      :model-value="modelValue"
      :default-value="modelValue"
      :items="plans"
      :placeholder="placeholder"
      unique-key="key"
      option-label-prop="label"
      class="grow"
      no-match-message="Plan not found."
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #default="{ item, boldMatchText }">
        <span v-html="boldMatchText(item?.label)" />
      </template>
    </SelectTypeahead>
  </div>
</template>

<style lang="scss" scoped>
:deep.typeahead {
  & > .typeahead-wrap {
    width: 100%;
    @apply w-full;
  }
  & .simple-typeahead-list {
    @apply z-10;
  }
}
</style>
