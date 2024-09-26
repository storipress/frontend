<script lang="ts" setup>
import type { Article, ScheduledArticleWithDay } from '../definitions'
import WeekCell from './week-cell.vue'
import { getWeek } from './helpers'
import type { dayjs } from '~/lib/dayjs'

const props = withDefaults(
  defineProps<{
    currentDay: dayjs.Dayjs
    articles?: Record<string, ScheduledArticleWithDay[]>
    newArticle?: Article
  }>(),
  {
    articles: () => ({}),
  },
)

const emit = defineEmits<(event: 'update:newArticle', article?: Article | undefined) => void>()

const modelNewArticle = useVModel(props, 'newArticle', emit)

const weekDays = computed(() => getWeek(props.currentDay))

const week = computed(() =>
  weekDays.value.map((day) => {
    const key = `${day.day()}`

    return {
      key,
      day,
      articlesOfDay: props.articles[key] || [],
    }
  }),
)
</script>

<template>
  <div
    v-for="{ key, day, articlesOfDay } of week"
    :key="key"
    class="min-h-[7.5rem] w-full flex-grow bg-white"
    :class="!newArticle && 'pointer-events-none'"
  >
    <WeekCell v-model:new-article="modelNewArticle" :day="day" :articles="articlesOfDay" />
  </div>
</template>
