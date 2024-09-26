import { groupBy, mapValues, stubFalse } from 'lodash-es'
import type { Ref } from 'vue'
import invariant from 'tiny-invariant'
import type { SortInput } from '../common'
import type { Article, ScheduledArticle, ScheduledArticleWithDay } from '../definitions'
import { useSchedulerStore } from '../store'
import { dayjs } from '~/lib/dayjs'

export function getWeek(today: dayjs.Dayjs): dayjs.Dayjs[] {
  return [today.subtract(1, 'day'), today, today.add(1, 'day'), today.add(2, 'day'), today.add(3, 'day')]
}

export function groupByWeek(
  articles: ScheduledArticleWithDay[],
): Record<string, Record<string, ScheduledArticleWithDay[]>> {
  return mapValues(
    groupBy(articles, (article) => article.day.hour()),
    (articles) => groupBy(articles, (article) => article.day.day()),
  )
}

// TODO: add test for this
export function compareArticleScheduledTime(a: ScheduledArticleWithDay, b: ScheduledArticleWithDay): number {
  if (!a.scheduledAt && !b.scheduledAt) {
    return Number.parseInt(a.id) - Number.parseInt(b.id)
  }

  if (!a.scheduledAt) {
    return 1
  }

  if (!b.scheduledAt) {
    return -1
  }

  const timeDiff = a.day.diff(b.day)

  if (timeDiff === 0) {
    return Number.parseInt(a.id) - Number.parseInt(b.id)
  }

  return timeDiff
}

export function isScheduledArticle(article: Article): article is ScheduledArticle {
  return article.scheduledAt != null
}

export interface GetProposedTimeOptions {
  start?: dayjs.Dayjs
  end?: dayjs.Dayjs
  boundStart: dayjs.Dayjs
  boundEnd: dayjs.Dayjs
  roundToMinutes: number
}

/*
  Rule for scheduling:
  IF ADD TO END/START: decrease / increase 30 mins
  IF ADD TO MIDDLE OF 2 CARDS WITH DIFFERENT TIMES: time inbetween 2 cards
  IF ADD TO MIDDLE OF 2 CARDS WITH SAME TIME: make same time
*/
export function getProposedTime({
  start,
  end,
  boundStart,
  boundEnd,
  roundToMinutes,
}: GetProposedTimeOptions): dayjs.Dayjs {
  // If no start or end time is given, we just the bound start time
  if (!start && !end) {
    return boundStart.utcOffset() === 0 ? boundStart.utc() : boundStart
  }

  // If add to end, increase 30 mins of previous card
  // If proposed time is after end, use the end time
  if (start && !end) {
    const proposal =
      start.utcOffset() === 0 ? start.utc().add(roundToMinutes, 'minute') : start.add(roundToMinutes, 'minute')
    if (proposal.isAfter(boundEnd)) {
      return boundEnd
    }
    return proposal
  }

  // If add to start
  // if boundStart <= end => use boundStart
  // if end < boundStart => end - roundToMinutes < startOfDat ? startOfDay : end - roundToMinutes
  if (!start && end) {
    if (!boundStart.isAfter(end)) {
      const startOfDay = boundStart.startOfDay()
      const proposal =
        end.utcOffset() === 0 ? end.utc().subtract(roundToMinutes, 'minute') : end.subtract(roundToMinutes, 'minute')
      return proposal.isAfter(startOfDay) ? proposal : startOfDay
    }
    return boundStart
  }
  invariant(start, 'start time is not defined')
  invariant(end, 'end time is not defined')
  return getMiddleTime(start, end, roundToMinutes)
}

export function getMiddleTime(start: dayjs.Dayjs, end: dayjs.Dayjs, roundToMinutes: number): dayjs.Dayjs {
  if (start.isSame(end)) {
    return start
  }

  const diff = end.diff(start, 'minute')
  const proposal = start.add(roundTo(diff / 2, roundToMinutes), 'minute')

  return proposal
}

export function roundTo(value: number, roundToTarget: number): number {
  return Math.round(value / roundToTarget) * roundToTarget
}

export interface UseScheduleArticlesOptions {
  articles: Readonly<Ref<ScheduledArticleWithDay[]>>
  boundStart: dayjs.Dayjs
  boundEnd: dayjs.Dayjs
  roundToMinutes: number
  isNeedExtend?: (index: number) => boolean
}

export function useScheduleArticles({
  articles,
  boundStart,
  boundEnd,
  roundToMinutes,
  isNeedExtend = stubFalse,
}: UseScheduleArticlesOptions) {
  const store = useSchedulerStore()
  const list = ref(toSorted(articles.value, compareArticleScheduledTime))
  const updatingArticle = ref<ScheduledArticleWithDay | null>()
  const proposedTime = ref<dayjs.Dayjs>()
  const needExtend = ref(false)
  const updatedId = computed(() => updatingArticle.value?.id ?? null)
  let lastUpdatingIndex = 0

  async function sortEnd({ newIndex, oldIndex }: SortInput) {
    if (oldIndex === newIndex) {
      return
    }

    needExtend.value = isNeedExtend(newIndex)

    const start = list.value[newIndex - 1]?.day
    const end = list.value[newIndex]?.day
    await nextTick()

    lastUpdatingIndex = newIndex
    updatingArticle.value = list.value[newIndex]
    proposedTime.value = getProposedTime({
      start,
      end,
      boundStart: dayjs(boundStart).tz(store.timezone, true),
      boundEnd: dayjs(boundEnd).tz(store.timezone, true),
      roundToMinutes,
    })
  }

  watch(articles, (articles) => {
    const workingArticle = updatingArticle.value
    const sortedArticle = toSorted(articles, compareArticleScheduledTime)
    if (workingArticle) {
      sortedArticle.splice(lastUpdatingIndex, 0, workingArticle)
    }
    list.value = sortedArticle
  })

  // whenever proposed time edit, resort list
  watch(proposedTime, (proposedTime) => {
    if (proposedTime) {
      // to reuse sorting logic and keep the data correct, we will need original value and patched object
      const workingList = list.value.map((a): [ScheduledArticleWithDay, ScheduledArticleWithDay] => [
        a,
        a.id === updatedId.value
          ? {
              ...a,
              scheduledAt: proposedTime.toDateTimeString(),
              day: proposedTime,
            }
          : a,
      ])

      workingList.sort(([, a], [, b]) => compareArticleScheduledTime(a, b))

      // get the original values
      list.value = workingList.map(([a]) => a)
    } else {
      lastUpdatingIndex = 0
      updatingArticle.value = null
      needExtend.value = false
    }
  })

  return {
    list,
    updatedId,
    proposedTime,
    sortEnd,
    needExtend,
  }
}

function toSorted<T>(array: T[], compareFn: (a: T, b: T) => number): T[] {
  const workingArray = array.slice()
  workingArray.sort(compareFn)
  return workingArray
}
