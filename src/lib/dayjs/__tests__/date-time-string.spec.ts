import { expect, it } from 'vitest'
import dayjs from 'dayjs'
import { dateTimeString } from '../date-time-string'

dayjs.extend(dateTimeString)

it('fromDateTimeString', () => {
  expect(dayjs.fromDateTimeString('2021-10-27T07:20:00Z').toISOString()).toMatchInlineSnapshot(
    '"2021-10-27T07:20:00.000Z"',
  )
  expect(dayjs.fromDateTimeString('2021-10-27T07:20:00+00:00').toISOString()).toMatchInlineSnapshot(
    '"2021-10-27T07:20:00.000Z"',
  )
})

it('toDateTimeString', () => {
  const isoDateTime = '2021-10-27T07:20:00.000Z'
  const dateTime = '2021-10-27T07:20:00Z'
  const date = new Date(isoDateTime)
  expect(dayjs(date).toDateTimeString()).toMatchInlineSnapshot('"2021-10-27T07:20:00Z"')
  expect(dayjs.fromDateTimeString(dateTime).toDateTimeString()).toEqual(dateTime)
})
