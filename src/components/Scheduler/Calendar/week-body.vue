<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { Article, ScheduledArticleWithDay } from '../definitions'
import { useSchedulerStore } from '../store'
import { timeMarks } from './definitions'
import TimeMark from './time-mark.vue'
import WeekRow from './week-row.vue'
import { getWeek, groupByWeek } from './helpers'
import type { dayjs } from '~/lib/dayjs'

const props = withDefaults(
  defineProps<{
    currentDay: dayjs.Dayjs
    today: dayjs.Dayjs
    articles?: ScheduledArticleWithDay[]
    scrollToNow?: boolean
    newArticle?: Article
  }>(),
  {
    articles: () => [],
    scrollToNow: false,
  },
)

const emit = defineEmits<(event: 'update:newArticle', article?: Article | undefined) => void>()

const modelNewArticle = useVModel(props, 'newArticle', emit)

const container = ref<HTMLElement>()
const containerNav = ref<HTMLElement>()
const containerOffset = ref<HTMLElement>()

const normalizedDay = computed(() => props.currentDay.startOfDay())
const weeks = computed(() => getWeek(props.currentDay))
const schedulerStore = useSchedulerStore()

watch(
  weeks,
  (weeks) => {
    schedulerStore.rangeStart = weeks[0].startOf('day').toDateTimeString()
    schedulerStore.rangeEnd = weeks[4].endOf('day').toDateTimeString()
  },
  { immediate: true },
)

const groupedArticles = computed(() => groupByWeek(props.articles))

onMounted(() => {
  if (!props.scrollToNow) {
    return
  }

  // Set the container scroll position based on the current time.
  const currentMinute = new Date().getHours() * 60
  container.value!.scrollTop =
    ((container.value!.scrollHeight - containerNav.value!.offsetHeight - containerOffset.value!.offsetHeight) *
      currentMinute) /
    1440
})
</script>

<template>
  <div ref="container" class="flex flex-auto flex-col overflow-auto bg-white">
    <div class="flex max-w-full flex-none flex-col">
      <div ref="containerNav" class="shadow sticky top-0 z-10 flex-none bg-white pr-14 ring-opacity-5">
        <div
          class="ml-14 grid grid-cols-5 divide-x divide-gray-300 border-b border-gray-300 text-sm leading-6 text-gray-500"
        >
          <div v-for="day of weeks" :key="day.unix()" class="flex flex-col items-start justify-center gap-1 px-2 py-1">
            <span
              class="text-subheading uppercase"
              :class="day.isSame(today, 'day') ? 'text-red-700' : 'text-stone-600'"
              >{{ day.format('ddd') }}</span
            >
            <span
              class="text-display-small block aspect-1 size-6 rounded-full text-center"
              :class="day.isSame(today, 'day') ? 'bg-sky-600 text-white ring ring-sky-600' : 'text-stone-800'"
              >{{ day.date() }}</span
            >
          </div>
        </div>
      </div>
      <div class="flex flex-auto bg-gray-200">
        <!-- left side space -->
        <div class="sticky left-0 w-14 flex-none bg-white" />

        <!-- right side space, use order-last to pull to right and maintain the correct stack order -->
        <div class="sticky right-0 top-0 z-0 order-last w-14 flex-none bg-white" />

        <!-- Cells, this must be at the bottom to show on top -->
        <div class="flex flex-grow flex-col gap-y-px">
          <!-- top padding -->
          <div v-once ref="containerOffset" class="grid h-7 w-full grid-cols-5 divide-x divide-gray-300">
            <div v-for="i of 5" :key="i" class="h-7 flex-auto bg-white" />
          </div>

          <div v-for="i of 24" :key="i" class="grid grid-cols-1 grid-rows-1">
            <TimeMark :current-day="currentDay" :mark="timeMarks[i - 1]" :hour="i - 1" />

            <!-- use grid here to ensure every cell claim exactly same width (flex may adjust width depended on content) -->
            <div class="col-start-1 col-end-2 row-start-1 grid grid-cols-5 divide-x divide-gray-300">
              <WeekRow
                v-model:new-article="modelNewArticle"
                :current-day="normalizedDay.set('hour', i - 1)"
                :articles="groupedArticles[i - 1]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
