import type { PluginFunc } from 'dayjs'

declare module 'dayjs' {
  function fromDateTimeString(dateTime: string): Dayjs

  interface Dayjs {
    toDateTimeString: () => string
  }
}

const SLICE_LENGTH = -5 // -'.sssZ'.length

export const dateTimeString: PluginFunc = (_, Dayjs, factory) => {
  factory.fromDateTimeString = (dateTime) => {
    return factory(dateTime)
  }

  Dayjs.prototype.toDateTimeString = function (): string {
    return `${this.toISOString().slice(0, SLICE_LENGTH)}Z`
  }
}
