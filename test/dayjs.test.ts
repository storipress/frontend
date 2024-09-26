import { describe, expect, it } from 'vitest'
import { dayjs } from '~/lib/dayjs'

// This test is a document of the edge cases of the library.
// So we can know the issues of the library.
// Also we can know the bug fixed or not.
// https://github.com/iamkun/dayjs/issues/1803
describe('dayjs with timezone = UTC', () => {
  it("wired behavior startOf('day')", () => {
    const date = dayjs.tz('2022-05-26T21:10:11', 'UTC')
    // https://github.com/iamkun/dayjs/blob/dev/src/plugin/timezone/index.js#L125
    // use .tz('UTC') to remove "true" args from `return startOfWithoutTz.tz(this.$x.$timezone, true)`
    const actual = date.startOf('day').tz('UTC')
    expect(actual.format()).toBe('2022-05-26T00:00:00+00:00')
    expect(actual.toISOString()).toBe('2022-05-26T00:00:00.000Z')
    expect(actual.date()).toBe(26)
    expect(actual.hour()).toBe(0)
    expect(actual.minute()).toBe(0)
    expect(actual.second()).toBe(0)
  })

  it('fixed startDay', () => {
    const date = dayjs.tz('2022-05-26T21:10:11', 'Asia/Taipei')
    const actual = date.startOfDay()
    expect(actual.format()).toBe('2022-05-26T00:00:00+08:00')
    expect(actual.toISOString()).toBe('2022-05-25T16:00:00.000Z')
    expect(actual.date()).toBe(26)
    expect(actual.hour()).toBe(0)
    expect(actual.minute()).toBe(0)
    expect(actual.second()).toBe(0)
  })

  it('it is work on toISOString and valueOf', () => {
    const date = dayjs.tz('2022-05-26T21:10:11', 'UTC')
    const actual = date.startOf('day')
    expect(date.toISOString()).toBe('2022-05-26T21:10:11.000Z')
    expect(actual.toISOString()).toBe('2022-05-26T00:00:00.000Z') // it's work
    expect(new Date(actual.valueOf()).toISOString()).toBe('2022-05-26T00:00:00.000Z') // it's work
  })
})

describe('dayjs in a timezone with offset 0', () => {
  it('manipulate Day.js object with subtract or add', () => {
    const date = dayjs('2022-10-10T10:00:00').tz('UTC', true)
    const result = date.subtract(30, 'minute')
    const actual = dayjs('2022-10-10T10:00:00').utc().subtract(30, 'minute').format('YYYY-MM-DDTHH:mm:ssZ')
    expect(result.format()).toBe(actual)
    expect(result.utc().format()).toBe('2022-10-10T09:30:00+00:00')
  })

  it('timezone is not with offset 0', () => {
    const date = dayjs('2022-10-10T10:00:00').tz('America/Toronto', true)
    const result = date.subtract(30, 'minute')
    expect(result.format()).toBe('2022-10-10T09:30:00-04:00')
  })
})
