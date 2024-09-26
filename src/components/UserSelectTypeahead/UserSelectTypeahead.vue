<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { SelectTypeahead } from '@storipress/core-component'
import type { UserType } from './definition'
import type { ListSimpleUsersQuery } from '~/graphql-operations'
import { ListSimpleUsersDocument } from '~/graphql-operations'
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
    },
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Array as PropType<UserType[]>,
      required: true,
    },
    filterOption: {
      type: Function as PropType<(option: any) => boolean>,
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const selectTypeaheadRef = ref()
    const route = useRoute()
    const { result } = useQuery<ListSimpleUsersQuery>(ListSimpleUsersDocument)
    const users = computed(() => {
      const temp = result.value?.users ?? []
      return props.filterOption ? temp?.filter((user) => user.role !== 'owner')?.filter(props.filterOption) : temp
    })

    whenever(
      () => props.modelValue.length === 0,
      () => {
        selectTypeaheadRef.value.selectedItems.clear()
      },
    )

    return { selectTypeaheadRef, users, route }
  },
})
</script>

<template>
  <SelectTypeahead
    ref="selectTypeaheadRef"
    :label="label"
    :model-value="modelValue"
    :default-value="modelValue"
    :items="users"
    :placeholder="placeholder"
    unique-key="id"
    option-label-prop="full_name"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="{ item, boldMatchText }">
      <img class="mr-2.5 size-6 rounded-xl" :src="item.avatar" alt="" />
      <span v-html="boldMatchText(item?.full_name)"></span>
    </template>
    <template #no-match-message>
      <div class="text-body px-4 pt-3 text-stone-800/75">
        User not found. Invite them in
        <router-link class="text-sky-600" :to="`/${route.params.clientID}/preferences/publication/team`">
          publication settings.
        </router-link>
      </div>
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
