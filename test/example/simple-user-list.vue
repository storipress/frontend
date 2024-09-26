<!-- modify from src/components/UserSelectTypeahead/UserSelectTypeahead.vue  -->
<script lang="ts" setup>
import { ListSimpleUsersDocument } from '~/graphql-operations'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const query = useVModel(props, 'modelValue', emit, { passive: true, defaultValue: '' })

const { result } = useQuery(ListSimpleUsersDocument)

const list = computed(() => {
  const users = result.value?.users ?? []

  if (!query.value) {
    return users
  }

  return users.filter((user) => user.full_name?.startsWith(query.value || ''))
})
</script>

<template>
  <div>
    <input v-model="query" />
    <div>
      <ul>
        <li v-for="item in list" :key="item.id">
          {{ item.full_name }}
        </li>
      </ul>
    </div>
  </div>
</template>
