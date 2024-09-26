import dayjs from 'dayjs'
import type { Dayjs, PluginFunc } from 'dayjs'

declare module 'dayjs' {
  interface Dayjs {
    startOfDay: () => Dayjs
    $x: {
      $timezone: string
    }
  }
}

// workaround of UTC bug
// ref: test/dayjs.test.ts
export const startOfDay: PluginFunc = (_, DayjsClass) => {
  DayjsClass.prototype.startOfDay = function (): Dayjs {
    return dayjs.tz(this.startOf('day').format('YYYY-MM-DD HH:mm:ss:SSS'), this.$x.$timezone)
  }
}
