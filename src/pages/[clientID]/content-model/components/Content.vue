<script lang="ts" setup>
import { CustomFieldGroupType } from '~/graphql-operations'
import type { CustomFieldGroupsQuery } from '~/graphql-operations'

type Groups = NonNullable<CustomFieldGroupsQuery['customFieldGroups']>['data']
const props = withDefaults(defineProps<{ groups: Groups }>(), {})

const typeClassMap = {
  [CustomFieldGroupType.ArticleContentBlock]: 'Editor Block',
  [CustomFieldGroupType.ArticleMetafield]: 'Article Metafield',
  [CustomFieldGroupType.DeskMetafield]: 'Tag Group (Desk)',
  [CustomFieldGroupType.PublicationMetafield]: 'Publication Metafield',
  [CustomFieldGroupType.TagMetafield]: 'Tag Group',
}

const router = useRouter()
const route = useRoute()

function onClick(id: string) {
  return router.push({
    name: 'content-model-edit',
    params: {
      clientID: route.params.clientID,
      id,
    },
  })
}
</script>

<template>
  <div class="bg-stone-50 p-6">
    <ul class="text-body overflow-hidden rounded-lg border bg-white shadow-1-layer">
      <li class="tr">
        <p class="item table-title">Name</p>
        <p class="item table-title">Description</p>
        <p class="item table-title">Class</p>
        <p class="item table-title">Fields</p>
      </li>
      <li
        v-for="group in props.groups"
        :key="group.id"
        class="tr cursor-pointer text-stone-500 transition-colors duration-75 hover:bg-stone-50"
        role="button"
        @click="onClick(group.id)"
      >
        <div class="item">
          <p class="mb-[.125rem] text-stone-800">{{ group.name }}</p>
          <p>{{ group.key }}</p>
        </div>
        <p class="item flex items-center text-stone-800">{{ group.description }}</p>
        <p class="item flex items-center">{{ typeClassMap[group.type] }}</p>
        <p class="item flex items-center">
          {{
            group.fields
              ?.map(({ name }) => name)
              .filter((name) => !name.startsWith('__'))
              .join(', ') || 'N/A'
          }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.table-title {
  @apply bg-stone-50 font-medium;
  @apply border-b-2 border-stone-200;
}
.tr {
  @apply grid grid-cols-[1fr_2fr_1fr_3fr];
}
.item {
  @apply px-5 py-[1.125rem];
}
</style>
