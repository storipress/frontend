<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { SelectTypeahead } from '@storipress/core-component'
import type { TagType } from './definition'
import type { GetTagsQuery } from '~/graphql-operations'
import { GetTagsDocument } from '~/graphql-operations'
import { useQuery } from '~/lib/apollo'

export default defineComponent({
  name: 'TagSelectTypeahead',
  components: {
    SelectTypeahead,
  },
  props: {
    type: {
      type: String as PropType<'line' | 'input'>,
      default: 'line',
      validator: (value: string) => ['line', 'input'].includes(value),
    },
    label: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Array as PropType<TagType[]>,
      required: true,
    },
    filterOption: {
      type: Function as PropType<(option: any) => boolean>,
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const { result } = useQuery<GetTagsQuery>(GetTagsDocument)
    const tags = computed(() => {
      const temp = result.value?.tags ?? []
      return props.filterOption ? temp?.filter(props.filterOption) : temp
    })
    return { tags }
  },
})
</script>

<template>
  <SelectTypeahead
    :label="label"
    :model-value="modelValue"
    :default-value="modelValue"
    :items="tags"
    :placeholder="placeholder"
    option-label-prop="name"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="{ item, boldMatchText }">
      <span v-html="boldMatchText(item?.name)"></span>
    </template>
  </SelectTypeahead>
</template>

<style lang="scss" scoped>
:deep.typeahead {
  & > .typeahead-wrap {
    width: 100%;
    @apply w-full;
  }
  & .simple-typeahead-list {
    @apply z-50;
  }
}
</style>
