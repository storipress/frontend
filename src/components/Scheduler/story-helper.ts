// This file provide an event bus for showing schedule events in Storybook.
import type { EventBusKey } from '@vueuse/core'
import type { dayjs } from './ArticleCard/dayjs'

export const ScheduleEventBus: EventBusKey<dayjs.Dayjs | Date> = Symbol('schedule-event-bus')
