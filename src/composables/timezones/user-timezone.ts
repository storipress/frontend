import { captureMessage } from '@sentry/vue'
import timezones from './timezones'
import type { Timezone } from './types'
import { dayjs } from '~/lib/dayjs'

function findTimezone(key: 'value' | 'offset', tz: string | number) {
  return timezones.find((timezone: Timezone) => timezone[key] === tz)
}
export function useUserTimezone(): string {
  const userTimezone = dayjs.tz.guess()
  if (findTimezone('value', userTimezone)) {
    return userTimezone
  } else {
    const userTimezoneOffset = dayjs().tz(userTimezone).utcOffset()
    const userTimezoneName = findTimezone('offset', userTimezoneOffset)?.value
    // skipcq: JS-0050
    if (userTimezoneName == null) {
      captureMessage(`Can not find a timezone value for offset ${userTimezoneOffset}`)
      return 'UTC'
    }
    return userTimezoneName
  }
}
