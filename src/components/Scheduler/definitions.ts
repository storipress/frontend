import type { Merge } from 'type-fest'
import type { dayjs } from '~/lib/dayjs'
import type { CalendarDate as CalendarDateWithoutEvent } from '~/lib/calendar'
import type { Stage } from '~/composables/stages'

export { Stage }

export interface User {
  id: string
  name: string
  avatar: string
}

export interface Article {
  id: string
  title: string
  authors: User[]
  editable: boolean
  stage: Stage
  desk: { id: string }
  /**
   * scheduled time
   * ! Notice: This string must be parsed with timezone
   */
  scheduledAt?: string
  isPublished?: boolean
  updatedAt: number
  published?: boolean
}

export type UnscheduledArticle = Merge<Article, { scheduledAt: undefined }>

export type ScheduledArticle = Merge<Article, { scheduledAt: string }>

export type ScheduledArticleWithDay = Merge<ScheduledArticle, { day: dayjs.Dayjs }>

export interface CalendarEvent {
  id: string | number
  article: ScheduledArticleWithDay
}

export interface CalendarDate extends CalendarDateWithoutEvent {
  events: CalendarEvent[]
}

// IMask mask type
export interface MaskLike {
  value: string
}

export enum Location {
  nav = 'nav',
  cal = 'cal',
}

export const dateFormat = 'DD/MM/YYYY'
export const timeFormat = 'hh:mm A'
export const dateTimeFormat = `${dateFormat} ${timeFormat}`

export enum ViewTypes {
  Month = 'Month',
  FiveDay = '5 Day',
}
