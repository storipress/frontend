<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import { parametersTypeMap } from '../definition'
import { CustomFieldGroupType } from '~/graphql-operations'

withDefaults(defineProps<{ tagGroups: { name: string; count: number; id?: string }[]; deskCount: number }>(), {
  tagGroups: () => [],
  desk: 0,
})

const route = useRoute()
const active = computed(() => {
  const group = route.params.group as string
  return parametersTypeMap[group as string] ?? group
})

const contentTypes = [
  { icon: 'svg', title: 'All', type: '', url: 'all' },
  { icon: 'lego', title: 'Article Block', type: CustomFieldGroupType.ArticleContentBlock, url: 'block' },
  { icon: 'swap-replace', title: 'Article Metafield', type: CustomFieldGroupType.ArticleMetafield, url: 'meta' },
]
</script>

<template>
  <div class="flex flex-col border-r border-stone-200 bg-stone-50 pb-6 pl-5 pr-[.563rem] pt-[1.375rem]">
    <h2 class="text-subheading mb-[.375rem] text-stone-600">Editor Content Types</h2>
    <nav>
      <router-link
        v-for="{ icon, title, type, url } in contentTypes"
        :key="title"
        :to="`/${route.params.clientID}/content-model/${url}`"
        class="list-item"
        :class="active === type && 'active'"
        replace
      >
        <Icon class="mr-4 w-5" :icon-name="icon" :class="active === title && 'text-emerald-700 '" />
        {{ title }}
      </router-link>
    </nav>

    <h2 class="text-subheading mb-[.375rem] mt-[1.875rem] text-stone-600">Tag Groups</h2>
    <nav class="flex-1">
      <router-link
        :to="`/${route.params.clientID}/content-model/desk`"
        class="list-item"
        :class="active === CustomFieldGroupType.DeskMetafield && 'active'"
        replace
      >
        <Icon class="mr-4 w-5" icon-name="desk" />
        Desks ({{ deskCount }})
      </router-link>
      <router-link
        v-for="{ name, count } in tagGroups"
        :key="`tag-${name}`"
        :to="`/${route.params.clientID}/content-model/tag-${name}`"
        class="list-item"
        :class="active === `tag-${name}` && 'active'"
        replace
      >
        <Icon class="mr-4 w-5" icon-name="tag" />
        {{ name }} ({{ count ?? 0 }})
      </router-link>
    </nav>
    <p class="text-body mr-2.5 text-stone-800">
      Read more about content types in our
      <a
        href="https://developers.storipress.com/karbon/2gLtVFS6QEkdvKF7fkRng1/content-modelling/qbTKo524jew8wHxWkGDBzJ"
        target="_blank"
        class="text-sky-600"
      >
        guide to content modelling.
      </a>
    </p>
  </div>
</template>

<style lang="postcss" scoped>
.list-item {
  @apply text-button -ml-5 flex h-8 cursor-pointer items-center rounded-r border-l-4 border-transparent pl-4 text-stone-600 transition-colors duration-75 hover:bg-stone-800/5;
}
.active {
  @apply border-emerald-700 bg-stone-800/5 text-emerald-700;
}
</style>
