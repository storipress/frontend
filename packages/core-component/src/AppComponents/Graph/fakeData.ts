import dayjs from 'dayjs'
import createSeedrandom from 'seedrandom'
import type { TRevenue, TSubscriber } from './types'

const random = createSeedrandom('graph')

export function generateSubscribers(length: number, startDate: number | string): TSubscriber[] {
  return [
    ...Array(length)
      .fill(0)
      .map((_, i) => ({
        subscribers: Math.floor(random() * 30 + i * 2),
        paid_subscribers: Math.floor(random() * 30 + i),
        date: dayjs(startDate)
          .add(i * 2, 'day')
          .toString(),
      })),
  ].reverse()
}

export function generateRevenue(length: number, startDate: number | string): TRevenue[] {
  return [
    ...Array(length)
      .fill(0)
      .map((_, i) => ({
        revenue: (random() * 5 + i).toFixed(2),
        date: dayjs(startDate).add(i, 'month').toString(),
      })),
  ].reverse()
}
