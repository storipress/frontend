import type { PluginFunc } from 'dayjs'

declare module 'dayjs' {
  interface Dayjs {
    toDisplayString: () => string
  }
}

export const toDisplayString: PluginFunc = (_, Dayjs, dayjs) => {
  Dayjs.prototype.toDisplayString = function (): string {
    const today = dayjs().startOf('day')
    const yesterday = today.subtract(1, 'day')
    const lastWeek = today.subtract(7, 'day')
    if (this.isBetween(today, today.endOf('day'))) {
      return this.format('kk:mm [Today]')
    }
    if (this.isBetween(yesterday, yesterday.endOf('day'))) {
      return this.format('kk:mm [Yesterday]')
    }
    if (this.isBetween(lastWeek, today)) {
      return this.format('kk:mm ddd')
    }

    return this.format('kk:mm ddd MMM')
  }
}
