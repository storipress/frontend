import type { ScheduledArticleWithDay } from '../definitions'
import type { dayjs } from '../ArticleCard/dayjs'

export interface CalendarEvent {
  id: string | number
  article: ScheduledArticleWithDay
}

export interface CalendarDate {
  date: string
  day: dayjs.Dayjs
  isCurrentMonth?: boolean
  isNextMonth?: boolean
  isToday?: boolean
  events: CalendarEvent[]
}

export const timeMarks = [
  '12 am',
  '1 am',
  '2 am',
  '3 am',
  '4 am',
  '5 am',
  '6 am',
  '7 am',
  '8 am',
  '9 am',
  '10 am',
  '11 am',
  'noon',
  '1 pm',
  '2 pm',
  '3 pm',
  '4 pm',
  '5 pm',
  '6 pm',
  '7 pm',
  '8 pm',
  '9 pm',
  '10 pm',
  '11 pm',
]
