<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import type { Article } from '../definitions'
import { Location, ViewTypes } from '../definitions'
import { getWholeMonth } from '../helpers'
import { SortableItem, SortableList } from '../common'
import { ArticleLoadingLine } from '../ArticleLoadingLine'
import { useSchedulerStore } from '../store'
import { isUnscheduledArticle, sortArticles } from './helper'
import { dayjs } from '~/lib/dayjs'
import { useUnpublishArticle, useUserPermission } from '~/composables'
import { useFeatureFlag } from '~/lib/feature-flag'

const props = withDefaults(
  defineProps<{
    today: dayjs.Dayjs
    articles?: Article[]
    viewType?: ViewTypes
    isLoading?: boolean
  }>(),
  {
    today: () => dayjs(),
    viewType: ViewTypes.Month,
    articles: () => [],
  },
)

const store = useSchedulerStore()

const enableSwitch = useFeatureFlag('scheduler-navigation-switch')

const userPermission = useUserPermission()

watch(
  () => props.today,
  (today) => {
    store.currentDay = today
  },
  { immediate: true, flush: 'sync' },
)

const currentDay = toRef(store, 'currentDay')
const days = computed(() => getWholeMonth(currentDay.value, props.today))
const list = ref(getSortedArticles())

function addMonth(amount: number) {
  currentDay.value = currentDay.value.add(amount, 'month')
}

function getSortedArticles() {
  return sortArticles(
    props.articles.filter((article) => isUnscheduledArticle(article)),
    userPermission.value.role,
    userPermission.value.userId,
  )
}

watch(
  () => props.articles,
  () => {
    list.value = getSortedArticles()
  },
)

const mutateUnschedule = useUnpublishArticle()

async function handleUnschedule({ value }: { value: Article }) {
  await mutateUnschedule({ id: value.id }, true)
}

function handleRemove({ oldIndex }: { oldIndex: number }) {
  list.value.splice(oldIndex, 1)
}

function getHighlightRangeClass({ day, isCurrentWeek }: (typeof days.value)[0]) {
  if (props.viewType === ViewTypes.FiveDay) {
    const isInRange =
      day.isBetween(store.rangeStart, store.rangeEnd, 'day') ||
      day.isSame(store.rangeStart, 'day') ||
      day.isSame(store.rangeEnd, 'day')
    return {
      'bg-stone-200': isInRange,
      'rounded-l-md': day.isSame(store.rangeStart, 'day'),
      'rounded-r-md': day.isSame(store.rangeEnd, 'day'),
    }
  }
  return {
    'bg-stone-200': isCurrentWeek,
    'rounded-l-md': day.day() === 1,
    'rounded-r-md': day.day() === 0,
  }
}
</script>

<template>
  <div class="relative z-[2] flex h-full flex-col border-r border-stone-200 bg-stone-100 px-2.5 pt-2">
    <div class="flex items-center pr-2">
      <button class="flex-auto text-left focus:outline-none" @click="currentDay = today">
        <span class="mr-1 text-[1.375rem] font-semibold text-stone-600">{{ currentDay.format('MMMM') }}</span
        ><span class="text-[1.375rem] font-light text-red-700">{{ currentDay.format('YYYY') }}</span>
      </button>
      <button
        v-if="enableSwitch"
        type="button"
        class="-my-1.5 flex flex-none items-center justify-center py-1 text-stone-600"
        @click="addMonth(-1)"
      >
        <span class="sr-only">Previous month</span>
        <Icon class="text-xs" icon-name="chevron_left" aria-hidden="true" />
      </button>
      <button
        v-if="enableSwitch"
        type="button"
        class="-my-1.5 -mr-1.5 ml-3 flex flex-none items-center justify-center py-1 text-stone-600"
        @click="addMonth(1)"
      >
        <span class="sr-only">Next month</span>
        <Icon class="text-xs" icon-name="chevron_right" aria-hidden="true" />
      </button>
    </div>
    <div class="text-subheading mt-3 grid grid-cols-7 text-center text-[0.5rem] text-stone-800">
      <div>MON</div>
      <div>TUE</div>
      <div>WED</div>
      <div>THU</div>
      <div>FRI</div>
      <div>SAT</div>
      <div>SUN</div>
    </div>
    <div class="mt-1 grid grid-cols-7 text-xs">
      <div v-for="day in days" :key="day.date" :class="getHighlightRangeClass(day)">
        <button
          type="button"
          class="mx-auto flex size-7 items-center justify-center rounded-full focus:outline-none"
          :class="[
            day.isToday && 'bg-sky-600 text-white',
            !day.isToday && day.isCurrentMonth && 'text-stone-800',
            !day.isToday && !day.isCurrentMonth && 'text-stone-800/25',
          ]"
        >
          <time :datetime="day.date">{{ day.day.date() }}</time>
        </button>
      </div>
    </div>
    <SortableList
      group="scheduler-navigation"
      :model-value="list"
      class="mt-6 space-y-1.5 overflow-auto"
      @sort-insert="handleUnschedule"
      @sort-remove="handleRemove"
    >
      <template v-if="isLoading">
        <ArticleLoadingLine v-for="index in 10" :key="index" class="h-[1.438rem] w-full shadow-1-layer" />
      </template>
      <SortableItem
        v-for="(article, index) of list"
        :key="article.id"
        :index="index"
        class="pointer-events-auto"
        :article="article"
        :loc="Location.nav"
      />
    </SortableList>
  </div>
</template>
