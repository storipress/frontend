<script lang="ts" setup>
import { dayjs } from '../ArticleCard/dayjs'
import type { Article, ScheduledArticle, ScheduledArticleWithDay } from '../definitions'
import { ViewTypes } from '../definitions'
import { useSchedulerStore } from '../store'
import CalendarHeader from './calendar-header.vue'
import { isScheduledArticle } from './helpers'
import MonthBody from './month-body.vue'
import WeekBody from './week-body.vue'

const props = withDefaults(
  defineProps<{
    today?: dayjs.Dayjs
    articles?: Article[]
    viewType?: ViewTypes
    scrollToNow?: boolean
    newArticle?: Article
    isLoading?: boolean
  }>(),
  {
    today: () => dayjs(),
    articles: () => [],
    viewType: ViewTypes.Month,
  },
)

const emit = defineEmits<{
  (event: 'update:viewType', viewType: string): void
  (event: 'update:newArticle', newArticle?: Article | undefined): void
}>()

const modelNewArticle = useVModel(props, 'newArticle', emit)

const store = useSchedulerStore()

watch(
  () => props.today,
  (today) => {
    store.currentDay = today
  },
  { immediate: true },
)

const modelViewType = useVModel(props, 'viewType', emit, { passive: true })

const scheduledArticles = computed<ScheduledArticleWithDay[]>(() =>
  props.articles
    .filter((article): article is ScheduledArticle => isScheduledArticle(article))
    .map(
      (article): ScheduledArticleWithDay => ({
        ...article,
        day: store.parseDate(article.scheduledAt),
      }),
    ),
)

// bind to store, so we can control it at another place
const currentDay = toRef(store, 'currentDay')

function addMonth(amount: number) {
  currentDay.value = currentDay.value.add(amount, 'month')
}

function addWeek(amount: number) {
  currentDay.value = currentDay.value.add(amount * 5, 'day')
}

function handlePage(amount: number) {
  if (modelViewType.value === ViewTypes.Month) {
    addMonth(amount)
  } else {
    addWeek(amount)
  }
}

function handleWeekView(day: dayjs.Dayjs) {
  currentDay.value = day
  modelViewType.value = ViewTypes.FiveDay
}
</script>

<template>
  <div class="layer-2 relative flex max-h-full flex-col bg-white">
    <CalendarHeader
      v-model:view-type="modelViewType"
      :day="currentDay"
      @click-previous="handlePage(-1)"
      @click-today="currentDay = today"
      @click-next="handlePage(1)"
    />

    <MonthBody
      v-if="modelViewType === ViewTypes.Month"
      v-model:new-article="modelNewArticle"
      :today="today"
      :current-day="currentDay"
      :articles="scheduledArticles"
      :is-loading="isLoading"
      @week-view="handleWeekView"
    />
    <WeekBody
      v-else
      v-model:new-article="modelNewArticle"
      :current-day="currentDay"
      :today="today"
      :articles="scheduledArticles"
      :scroll-to-now="scrollToNow"
    />
  </div>
</template>
