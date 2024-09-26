<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { useResizeObserver } from '@vueuse/core'
import { SortableItem, SortableList } from '../common'
import type { Article } from '../definitions'
import { Location } from '../definitions'
import { ArticleLine } from '../ArticleLine'
import { useSchedulerStore } from '../store'
import { ArticleLoadingLine } from '../ArticleLoadingLine'
import type { CalendarDate } from './definitions'
import { useScheduleArticles } from './helpers'
import { dayjs } from '~/lib/dayjs'
import { useNewArticle } from '~/composables'
import type { NewArticleInput, UpdateCacheFn } from '~/components/NewArticle/definitions'
import { GetMeDocument, ListArticlesDocument } from '~/graphql-operations'
import { useCalendarStore } from '~/stores/calendar'

const props = withDefaults(
  defineProps<{
    day: CalendarDate
    isExpand?: boolean
    newArticle?: Article
    isLoading?: boolean
    loadingCardNum?: number
    dayIndex?: number
  }>(),
  {
    isExpand: false,
    dayIndex: undefined,
  },
)

const emit = defineEmits<{
  (event: 'weekView', day: dayjs.Dayjs): void
  (event: 'update:newArticle', newArticle?: Article | undefined): void
}>()
const store = useSchedulerStore()
const _openNewArticle = useNewArticle()

function openNewArticle() {
  const published_at = props.day.day.set('hour', 11).startOf('hour').toDateTimeString()
  const updateApolloCache: UpdateCacheFn = (cache, data) => {
    const newArticle = data?.createArticle
    const articlesQuery = cache.readQuery({
      query: ListArticlesDocument,
      variables: {
        range: { from: store.range.from, to: store.range.to },
      },
    })
    const meQuery = cache.readQuery({ query: GetMeDocument })
    if (newArticle && articlesQuery?.articles && meQuery?.me) {
      const articles = [
        ...articlesQuery.articles,
        {
          ...newArticle,
          updated_at: new Date().toISOString(),
          published: true,
          scheduled: true,
          published_at,
          authors: [meQuery?.me],
          tags: [],
          stage: {
            ...newArticle.stage,
            color: '',
            order: 0,
            icon: '',
          },
        },
      ]
      cache.writeQuery({
        query: ListArticlesDocument,
        variables: {
          range: { from: store.range.from, to: store.range.to },
        },
        data: { articles },
      })
    }
  }
  _openNewArticle({
    openEditor: false,
    updateApolloCache,
    extraFields: { published_at },
  } as NewArticleInput)
}

const isExpandable = computed(() => !props.newArticle && !props.isExpand && props.day.events.length <= 5)

const displayDay = computed(() => {
  const { day, isNextMonth } = props.day
  if (isNextMonth) {
    return day.format('MMM D')
  }

  return day.format('D')
})

const events = computed(() => props.day.events.map((event) => event.article))
const boundStart = props.day.day.startOfDay().set('hour', 10)

const {
  list: originalList,
  updatedId,
  proposedTime,
  sortEnd,
  needExtend,
} = useScheduleArticles({
  articles: events,
  boundStart,
  boundEnd: props.day.day.startOf('day').set('hour', 20),
  roundToMinutes: 30,
  isNeedExtend: (index) => index >= 3,
})
const sizeOffset = ref(0)
const cellEl = ref<HTMLElement | null>(null)

const originalSizeLimit = computed(() => (needExtend.value ? 4 : 3))
const sizeLimit = computed(() => Math.max(originalSizeLimit.value - sizeOffset.value, 0))

const list = computed({
  get: () => {
    if (props.isExpand) {
      return originalList.value
    }

    return originalList.value.slice(0, sizeLimit.value)
  },
  set: (newList) => {
    // when expanding, there is no hidden articles
    if (props.isExpand) {
      originalList.value = newList
      return
    }
    originalList.value = [...newList, ...originalList.value.slice(sizeLimit.value)]
  },
})

const hasMore = computed(() => !props.isExpand && originalList.value.length > sizeLimit.value)

const dragActive = ref(false)
const calendarStore = useCalendarStore()
const currentIndex = computed(() => calendarStore.currentIndex)
const show = computed(() => {
  return props.dayIndex === currentIndex.value && hasMore.value
})

const backgroundClass = computed(() => {
  if (!props.day.isCurrentMonth) {
    return 'bg-gray-50'
  }
  if (dragActive.value) {
    return 'bg-sky-50/50'
  }
  return 'bg-white'
})

whenever(dragActive, () => {
  if (props.dayIndex) {
    calendarStore.setIndex(props.dayIndex)
  }
})
whenever(show, () => {
  dragActive.value = false
})

function resizeCell() {
  if (show.value) {
    return
  }
  if (cellEl.value) {
    const hasMoreHeight =
      (cellEl.value.querySelector('.has-more') as HTMLElement)?.offsetHeight ?? (hasMore.value ? 22 : 0)
    const remainingItemNumber = Math.max(Math.floor((cellEl.value?.clientHeight - hasMoreHeight) / 24), 0)
    sizeOffset.value = Math.max(originalSizeLimit.value - remainingItemNumber, 0)
  }
}

useResizeObserver(cellEl, resizeCell)
watch([hasMore, cellEl], resizeCell)

function emitWeekView() {
  if (isExpandable.value) {
    return
  }
  emit('weekView', props.day.day)
}

function handleSchedule() {
  if (!props.newArticle) {
    return
  }
  if (props.isExpand) {
    return
  }
  store.scheduledAt = props.day.date
}

function handleUpdateNewArticle(article: Article) {
  const currentTime = dayjs()
  const isPublished = currentTime.isAfter(props.day.date)
  emit('update:newArticle', { ...article, isPublished })
}
</script>

<template>
  <component
    :is="isExpandable || show ? Popover : 'div'"
    :ref="(comp: any) => (cellEl = (isExpandable || show ? comp?.el : comp)?.querySelector('.cell-content'))"
    v-slot="receiveProps"
    class="group text-body relative flex max-h-full flex-col px-1 py-2 text-stone-800"
    :class="[backgroundClass, newArticle ? 'cursor-pointer transition-colors hover:bg-gray-100' : '', { 'h-0': show }]"
    role="cell"
    :aria-label="day.date"
    @click="handleSchedule"
  >
    <div class="flex justify-between pr-1">
      <button
        class="invisible flex items-center text-xl leading-none text-stone-200 opacity-0 group-hover:transition-opacity group-hover:duration-100"
        :class="!isLoading && !newArticle && 'group-hover:visible group-hover:opacity-100'"
        @click="openNewArticle"
      >
        <Icon icon-name="plus_circle" />
        <span class="text-caption ml-1.5 hidden whitespace-nowrap pt-0.5 text-stone-200 lg:inline">New Story</span>
      </button>
      <time
        :datetime="day.date"
        class="text-body flex h-6 min-w-[1.5rem] items-center justify-center whitespace-nowrap rounded-full"
        :class="day.isToday && 'bg-sky-600 text-white ring-2 ring-sky-600'"
        >{{ displayDay }}</time
      >
    </div>
    <div v-if="newArticle">
      <ArticleLine
        v-if="store.scheduledAt === day.date"
        :article="newArticle"
        :proposed-time="boundStart"
        :auto-publish="false"
        @scheduled="handleUpdateNewArticle"
      />
    </div>
    <SortableList
      v-model="list"
      v-model:drag-active="dragActive"
      group="scheduler-calendar"
      class="cell-content mt-2 flex-grow overflow-hidden"
      @sort-end="sortEnd"
    >
      <template v-if="isLoading">
        <ArticleLoadingLine
          v-for="index in loadingCardNum"
          :key="index"
          class="h-6 w-full border-[#fbfbfb] bg-gray-50 shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.1),0_1px_1px_0_rgba(0,0,0,0.1)]"
        />
      </template>
      <SortableItem
        v-for="(article, index) of list"
        :key="article.id"
        :index="index"
        :class="{
          hidden: article.id === newArticle?.id && store.scheduledAt === day.date,
          'pointer-events-none': newArticle,
          'pointer-events-auto': !newArticle,
        }"
        :article="article"
        :proposed-time="updatedId === article.id ? proposedTime : undefined"
        :loc="Location.cal"
        :disabled="!!newArticle"
        @update:proposed-time="proposedTime = $event"
      />
      <div v-if="hasMore" class="has-more text-body rounded-sm border border-gray-100 text-center text-stone-500">
        <component :is="isExpandable ? PopoverButton : 'button'" class="focus:outline-none" @click="emitWeekView"
          >+{{ originalList.length - sizeLimit }} more articles</component
        >
      </div>
    </SortableList>
    <PopoverPanel v-if="show || receiveProps?.open" static class="layer-2 absolute left-0 top-0 z-10 w-full bg-white">
      <CalendarCell :day="day" is-expand />
    </PopoverPanel>
  </component>
</template>
