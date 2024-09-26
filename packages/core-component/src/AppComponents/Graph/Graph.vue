<script lang="ts" setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { getOptions } from './chart-options'
import type { TRevenue, TSeries, TSeriesItemData, TSubscriber } from './types'
import { filterAllList } from './utils'
import { GraphType, RevenueShowLevel, ShowLevel, SubscribersShowLevel } from './enums'
import GraphButton from './GraphButton.vue'
import GraphRoot from './GraphRoot.vue'
import GraphContent from './GraphContent.vue'
import GraphHeader from './GraphHeader.vue'

defineOptions({ name: 'Graph' })

const props = withDefaults(
  defineProps<{
    subscribers: TSubscriber[]
    revenue: TRevenue[]
    today?: string
    animation?: boolean
  }>(),
  {
    subscribers: () => [],
    revenue: () => [],
    today: undefined,
    animation: true,
  },
)

const graphType = ref<GraphType>(GraphType.Subscribers)
const showLevel = ref<ShowLevel>(ShowLevel.Lv1)

function getDataSlice<T extends TSubscriber | TRevenue>(list: T[], showLevel: number, defaultData: Partial<T>): T[] {
  if (showLevel === Number.POSITIVE_INFINITY) {
    if (list.length) return filterAllList(list)
    showLevel = 6
  }

  const subscribersDefaultDate = dayjs(list[list.length - 1]?.date ?? props.today)
  const revenueDefaultDate = dayjs(list[list.length - 1]?.date ?? props.today).date(1)
  const defaultDate = graphType.value === GraphType.Subscribers ? subscribersDefaultDate : revenueDefaultDate

  return [
    ...list.slice(0, showLevel),
    ...(Array(showLevel)
      .fill(defaultDate)
      .map((date, i) => ({
        ...defaultData,
        date: date.subtract(i + 1, graphType.value === GraphType.Subscribers ? 'day' : 'month').toString(),
      })) as T[]),
  ].slice(0, showLevel)
}

const subscribers = computed<TSeries>(() => {
  const sortedSubscribers = [...props.subscribers].sort((a, b) => {
    const aDate = dayjs(a.date)
    const bDate = dayjs(b.date)
    return aDate.isBefore(bDate) ? 1 : -1
  })
  const subscribers = getDataSlice<TSubscriber>(sortedSubscribers, SubscribersShowLevel[showLevel.value], {
    subscribers: 0,
    paid_subscribers: 0,
  })

  const subscribersData: TSeriesItemData = subscribers.map(({ subscribers, date }) => [date, subscribers])
  const paidSubscribersData: TSeriesItemData = subscribers.map(({ paid_subscribers, date }) => [date, paid_subscribers])

  return [
    {
      name: 'All subscribers',
      data: subscribersData,
    },
    {
      name: 'Paid Subscribers',
      data: paidSubscribersData,
    },
  ]
})

const revenue = computed<TSeries>(() => {
  const sortedRevenue = [...props.revenue].sort((a, b) => {
    const aDate = dayjs(a.date)
    const bDate = dayjs(b.date)
    return aDate.isBefore(bDate) ? 1 : -1
  })
  const revenue = getDataSlice<TRevenue>(sortedRevenue, RevenueShowLevel[showLevel.value], {
    revenue: '0',
  })

  const revenueData: TSeriesItemData = revenue.map(({ revenue, date }) => [date, Number(revenue)])

  return [
    {
      name: 'Monthly Recurring Subscription Revenue',
      data: revenueData,
    },
  ]
})

const series = computed<TSeries>(() => {
  if (graphType.value === GraphType.Subscribers) return subscribers.value
  if (graphType.value === GraphType.Revenue) return revenue.value
  return [] as TSeries
})

const currentOptions = computed(() => {
  const options = getOptions(graphType.value)
  return {
    ...options,
    chart: {
      ...options.chart,
      animations: {
        enabled: props.animation,
      },
    },
  }
})
</script>

<template>
  <GraphRoot :animation="animation">
    <GraphHeader>
      <GraphButton :active="graphType === GraphType.Subscribers" @click="graphType = GraphType.Subscribers">
        Subscribers
      </GraphButton>
      <GraphButton :active="graphType === GraphType.Revenue" @click="graphType = GraphType.Revenue">
        Revenue
      </GraphButton>
      <div class="flex-1" />
      <GraphButton :active="showLevel === ShowLevel.Lv1" @click="showLevel = ShowLevel.Lv1">
        {{ graphType === GraphType.Subscribers ? '30 days' : '6 months' }}
      </GraphButton>
      <GraphButton :active="showLevel === ShowLevel.Lv2" @click="showLevel = ShowLevel.Lv2">
        {{ graphType === GraphType.Subscribers ? '90 days' : '1 year' }}
      </GraphButton>
      <GraphButton :active="showLevel === ShowLevel.All" @click="showLevel = ShowLevel.All"> all time </GraphButton>
    </GraphHeader>
    <GraphContent :options="currentOptions" :series="series" />
  </GraphRoot>
</template>
