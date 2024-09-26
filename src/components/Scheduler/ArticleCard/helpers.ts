import type { MaskLike } from '../definitions'
import { useSchedulerStore } from '../store'
import { dayjs } from '~/lib/dayjs'

export function padDigit(value: string, mask: MaskLike) {
  if (value.length >= 2) {
    return
  }
  mask.value = value.padStart(2, '0')
}

export type Formatter = (time: dayjs.Dayjs | Date | string) => string

export function useFormatTime(format: string): Formatter {
  const store = useSchedulerStore()

  return (time: dayjs.Dayjs | Date | string) => {
    if (dayjs.isDayjs(time)) {
      return time.format(format)
    }

    return store.parseDate(time).format(format)
  }
}

export function to12hour(hour: number) {
  if (hour === 0) {
    return 12
  }

  return hour > 12 ? hour - 12 : hour
}
