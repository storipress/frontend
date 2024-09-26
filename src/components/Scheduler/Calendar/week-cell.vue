<script lang="ts" setup>
import type { Article, ScheduledArticleWithDay } from '../definitions'
import { Location } from '../definitions'
import { SortableItem, SortableList } from '../common'
import { ArticleLine } from '../ArticleLine'
import { useSchedulerStore } from '../store'
import { useScheduleArticles } from './helpers'
import { dayjs } from '~/lib/dayjs'

const props = withDefaults(
  defineProps<{
    articles?: ScheduledArticleWithDay[]
    newArticle?: Article
    day: dayjs.Dayjs
  }>(),
  {
    articles: () => [],
  },
)

const emit = defineEmits<(event: 'update:newArticle', article?: Article | undefined) => void>()

const store = useSchedulerStore()

const { list, updatedId, proposedTime, sortEnd } = useScheduleArticles({
  articles: toRef(props, 'articles'),
  boundStart: props.day,
  boundEnd: props.day.add(1, 'hour'),
  roundToMinutes: 10,
})
const label = computed(() => props.day.format('YYYY-MM-DD HH:mm'))
const dragActive = ref(false)

function handleSchedule() {
  if (!props.newArticle) {
    return
  }

  store.scheduledAt = label.value
}

function handleUpdateNewArticle(article: Article) {
  const currentTime = dayjs()
  const isPublished = currentTime.isAfter(props.day)
  emit('update:newArticle', { ...article, isPublished })
}
</script>

<template>
  <SortableList
    v-model="list"
    v-model:drag-active="dragActive"
    group="scheduler-calendar"
    class="h-full"
    :class="[
      dragActive && 'bg-sky-50/50',
      newArticle ? 'pointer-events-auto cursor-pointer transition-colors hover:bg-gray-100' : '',
    ]"
    role="cell"
    :aria-label="label"
    @sort-end="sortEnd"
    @click="handleSchedule"
  >
    <ArticleLine
      v-if="newArticle && store.scheduledAt === label"
      :article="newArticle"
      :proposed-time="day"
      :auto-publish="false"
      @scheduled="handleUpdateNewArticle"
    />
    <SortableItem
      v-for="(article, index) of list"
      :key="article.id"
      :index="index"
      :class="newArticle ? 'pointer-events-none' : 'pointer-events-auto'"
      :article="article"
      :disabled="!!newArticle"
      :proposed-time="updatedId == article.id ? proposedTime : undefined"
      :loc="Location.cal"
      @update:proposed-time="proposedTime = undefined"
    />
  </SortableList>
</template>
