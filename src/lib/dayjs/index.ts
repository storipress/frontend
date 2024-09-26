import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import updateLocale from 'dayjs/plugin/updateLocale'
import { dateTimeString } from './date-time-string'
import { toDisplayString } from './display-time'
import { startOfDay } from './start-of-day'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(advancedFormat)
dayjs.extend(isBetween)
dayjs.extend(timezone)
dayjs.extend(dateTimeString)
dayjs.extend(toDisplayString)
dayjs.extend(startOfDay)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  weekStart: 1,
})

export { dayjs }
