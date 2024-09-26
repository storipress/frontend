import { expect, it } from 'vitest'
import { dedent } from 'ts-dedent'
import { dayjs } from '../dayjs'
import { getWholeMonth } from '../calendar'

// test helper function
function convertCalendarToDays(day: dayjs.Dayjs, cal: string) {
  let foundFirstDay = 0
  const previous = day.subtract(1, 'month').date(1)
  const next = day.add(1, 'month').date(1)
  const dates = cal.replaceAll(/[\n ]+/g, ' ').split(' ')
  const days = []

  for (const date of dates) {
    const d = Number.parseInt(date, 10)
    if (d === 1) {
      foundFirstDay += 1
    }
    if (foundFirstDay === 0) {
      // previous month
      days.push(previous.set('date', d))
    } else if (foundFirstDay === 1) {
      // current month
      days.push(day.set('date', d))
    } else if (foundFirstDay === 2) {
      // next month
      days.push(next.set('date', d))
    }
  }

  return days
}

// test case is generate by unix cal utility `ncal -1Mbm <month>`
describe('convertCalendarToDays', () => {
  it('convertCalendarToDays function work', () => {
    const date = dayjs('2022-01-01')
    const cal = dedent`
  27 28 29 30 31  1  2
  3  4  5  6  7  8  9
  10 11 12 13 14 15 16
  17 18 19 20 21 22 23
  24 25 26 27 28 29 30
  31 1  2  3  4  5  6
  `

    const days = convertCalendarToDays(date, cal)
    expect(days).toHaveLength(42)
    expect(days.map((d) => d.format('YYYY-MM-DD'))).toMatchSnapshot()
  })

  it('convertCalendarToDays function work if start at 1', () => {
    const date = dayjs('2022-08-01')
    const cal = dedent`
  1  2  3  4  5  6  7
  8  9 10 11 12 13 14
  15 16 17 18 19 20 21
  22 23 24 25 26 27 28
  29 30 31  1  2  3  4
  `

    const days = convertCalendarToDays(date, cal)
    expect(days).toHaveLength(35)
    expect(days.map((d) => d.format('YYYY-MM-DD'))).toMatchSnapshot()
  })
})

it.each([
  [
    '2022-01-01',
    dedent`
  27 28 29 30 31  1  2
  3  4  5  6  7  8  9
  10 11 12 13 14 15 16
  17 18 19 20 21 22 23
  24 25 26 27 28 29 30
  31 1  2  3  4  5  6
  `,
  ],
  [
    '2022-06-01',
    dedent`
30  31  1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30  1  2  3`,
  ],
  [
    '2022-08-01',
    dedent`
  1  2  3  4  5  6  7
  8  9 10 11 12 13 14
  15 16 17 18 19 20 21
  22 23 24 25 26 27 28
  29 30 31  1  2  3  4
  `,
  ],
])('getWholeMonth work correctly with %s', (date, cal) => {
  const day = dayjs(date)
  const expectDays = convertCalendarToDays(day, cal)

  const month = getWholeMonth(day, day)
  expect(month).toHaveLength(expectDays.length)
  // check calendar days are correct
  for (const [i, { day }] of month.entries()) {
    expect(day.isSame(expectDays[i], 'day')).toBe(true)
  }
})
