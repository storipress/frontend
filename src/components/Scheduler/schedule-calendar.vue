<script lang="ts" setup>
import { twMerge } from 'tailwind-merge'
import { Calendar } from './Calendar'
import { normalizeArticle, useScheduler } from './helpers'
import type { Article } from './definitions'
import { useArticlePermission } from '~/composables/permission/article'
import { ListArticlesDocument } from '~/graphql-operations'

const props = defineProps<{ newArticle: Article }>()
const emit = defineEmits<(event: 'update:newArticle', newArticle?: Article) => void>()

const modelNewArticle = useVModel(props, 'newArticle', emit)

const { today, range } = useScheduler()

const { canEdit } = useArticlePermission()
const { result } = useQuery(ListArticlesDocument, range)
const articles = computed(
  () => result.value?.articles.map((item) => normalizeArticle(item, (article) => canEdit(article).value)) ?? [],
)
</script>

<template>
  <Calendar
    v-model:new-article="modelNewArticle"
    :class="twMerge('h-full w-full rounded-tl-xl', $attrs.class as string)"
    :today="today"
    :articles="articles"
    scroll-to-now
  />
</template>
