<script lang="ts" setup>
import { groupBy, mapValues } from 'lodash-es'
import { useVModel } from '@vueuse/core'
import type { dayjs } from '../ArticleCard/dayjs'
import type { Article, ScheduledArticleWithDay } from '../definitions'
import { getWholeMonth } from '../helpers'
import { useSchedulerStore } from '../store'
import CalendarCell from './calendar-cell.vue'
import { compareArticleScheduledTime } from './helpers'

const props = withDefaults(
  defineProps<{
    currentDay: dayjs.Dayjs
    today: dayjs.Dayjs
    articles?: ScheduledArticleWithDay[]
    newArticle?: Article
    isLoading?: boolean
  }>(),
  {
    articles: () => [],
  },
)

const emit = defineEmits<{
  (event: 'weekView', day: dayjs.Dayjs): void
  (event: 'update:newArticle', newArticle?: Article | undefined): void
}>()

const schedulerStore = useSchedulerStore()

const modelNewArticle = useVModel(props, 'newArticle', emit)

const wholeMonth = computed(() => getWholeMonth(props.currentDay, props.today))

watch(
  () => `${props.currentDay?.toString()} ${props.today?.toString()}`,
  () => {
    schedulerStore.rangeStart = wholeMonth.value[0].day.startOf('month').toDateTimeString()
    schedulerStore.rangeEnd = wholeMonth.value[wholeMonth.value.length - 1].day.endOf('month').toDateTimeString()
  },
  { immediate: true },
)

const articleMap = computed(() =>
  mapValues(
    groupBy(props.articles, (article) => {
      return article.day.format('YYYY-MM-DD')
    }),
    (articles) => {
      articles.sort(compareArticleScheduledTime)
      return articles
    },
  ),
)

const days = computed(() => {
  const map = articleMap.value

  return wholeMonth.value.map((day) => {
    const articles = map[day.date] || []
    return {
      ...day,
      events: articles.map((article) => ({
        id: article.id,
        article,
        datetime: article.day.toISOString(),
      })),
    }
  })
})

const loadingMap: Record<number, number> = { 0: 1, 9: 3, 24: 1, 26: 1 }
</script>

<template>
  <div class="flex h-full max-h-full flex-auto flex-col overflow-scroll">
    <div
      class="grid shrink-0 grid-cols-7 gap-px border-b border-gray-300 text-right text-xs font-semibold leading-4 text-stone-800 lg:flex-none"
    >
      <div class="py-1 pr-2">MON</div>
      <div class="py-1 pr-2">TUE</div>
      <div class="py-1 pr-2">WED</div>
      <div class="py-1 pr-2">THU</div>
      <div class="py-1 pr-2">FRI</div>
      <div class="py-1 pr-2">SAT</div>
      <div class="py-1 pr-2">SUN</div>
    </div>
    <div class="flex h-full max-h-full flex-auto overflow-scroll bg-gray-100 text-xs leading-6 text-gray-700">
      <div class="grid min-h-[27rem] w-full grow grid-cols-7 grid-rows-[repeat(auto-fit,minmax(0,1fr))] gap-px">
        <CalendarCell
          v-for="(day, index) in days"
          :key="day.date"
          v-model:new-article="modelNewArticle"
          :day="day"
          :is-loading="isLoading"
          :loading-card-num="loadingMap[index] || 0"
          :day-index="index"
          @week-view="$emit('weekView', $event)"
        />
      </div>
    </div>
  </div>
</template>
