<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { SelectTypeahead } from '@storipress/core-component'
import type { DeskType } from './definition'
import { ListDesksDocument } from '~/graphql-operations'
import { useQuery } from '~/lib/apollo'

export default defineComponent({
  name: 'UserSelectTypeahead',
  components: {
    SelectTypeahead,
  },
  props: {
    label: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Array as PropType<DeskType[]>,
      required: true,
    },
    filterOption: {
      type: Function as PropType<(option: any) => boolean>,
      default: () => true,
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const { result } = useQuery(ListDesksDocument)
    const desks = computed(() => {
      const flatDesks =
        result.value?.desks?.flatMap((desk) => {
          const subDesk = desk.desks ?? []
          return [desk, ...subDesk]
        }) ?? []
      return flatDesks?.filter(props.filterOption)
    })
    return { desks }
  },
})
</script>

<template>
  <SelectTypeahead
    :label="label"
    :model-value="modelValue"
    :default-value="modelValue"
    :items="desks"
    :placeholder="placeholder"
    option-label-prop="name"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="{ item, boldMatchText }">
      <span :class="{ 'border-l-2 pl-2': !item.desks }" v-html="boldMatchText(item?.name)" />
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
    @apply z-10;
  }
}
</style>
