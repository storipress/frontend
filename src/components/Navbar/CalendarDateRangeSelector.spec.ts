import { fireEvent } from '@testing-library/vue'
import { expect, it } from 'vitest'
import CalendarDateRangeSelector from './CalendarDateRangeSelector.vue'
import { dayjs } from '~/lib/dayjs'
import { render } from '~/test-helpers'

const date = dayjs('2022/06/01').tz('Pacific/Honolulu', true)

it('switch month', async () => {
  const { getByText, getByRole, getAllByRole } = render(CalendarDateRangeSelector, {
    props: {
      modelValue: [],
      defaultDate: date,
    },
  })

  const nextMonthButton = getByRole('button', { name: /to next month/i })
  const previousMonthButton = getByRole('button', { name: /to previous month/i })

  expect(getByText(new RegExp(date.format('MMMM YYYY'), 'i'))).toBeVisible()
  expect(getAllByRole('button', { name: /current month/i })).toHaveLength(30)
  expect(getAllByRole('button', { name: /(prev|next) month/i })).toHaveLength(6)

  await fireEvent.click(nextMonthButton)
  expect(getByText(new RegExp(date.add(1, 'month').format('MMMM YYYY'), 'i'))).toBeVisible()
  expect(getAllByRole('button', { name: /current month/i })).toHaveLength(31)
  expect(getAllByRole('button', { name: /(prev|next) month/i })).toHaveLength(12)

  await fireEvent.click(previousMonthButton)
  expect(getByText(new RegExp(date.format('MMMM YYYY'), 'i'))).toBeVisible()
  expect(getAllByRole('button', { name: /current month/i })).toHaveLength(30)
  expect(getAllByRole('button', { name: /(prev|next) month/i })).toHaveLength(6)
})

it('selected a single day', async () => {
  const { getByRole, emitted } = render(CalendarDateRangeSelector, {
    props: {
      modelValue: [],
      defaultDate: date,
    },
  })
  const button20220610 = getByRole('button', { name: /current month 10/i })
  const expectDate = [dayjs('2022/06/10').startOf('date').toDate(), dayjs('2022/06/10').endOf('date').toDate()]

  await fireEvent.click(button20220610)
  await fireEvent.click(button20220610)

  expect(emitted()['update:modelValue'][0]).toEqual([expectDate])
})

it('selected across month date', async () => {
  const { getByRole, emitted } = render(CalendarDateRangeSelector, {
    props: {
      modelValue: [],
      defaultDate: date,
    },
  })

  const expectDate = [dayjs('2022/06/10').startOf('date').toDate(), dayjs('2022/07/10').endOf('date').toDate()]

  const button20220610 = getByRole('button', { name: /current month 10/i })
  const button20220701 = getByRole('button', { name: /next month 1/i })
  await fireEvent.click(button20220610)
  await fireEvent.click(button20220701)

  const button20220710 = getByRole('button', { name: /current month 10/i })
  await fireEvent.mouseEnter(button20220710)
  await fireEvent.click(button20220710)

  expect(emitted()['update:modelValue'][0]).toEqual([expectDate])
})

it('clear selected', async () => {
  const { getByRole, emitted } = render(CalendarDateRangeSelector, {
    props: {
      modelValue: [],
      defaultDate: date,
    },
  })

  const clearButton = getByRole('button', { name: /clear/i })
  const button20220610 = getByRole('button', { name: /current month 10/i })
  await fireEvent.click(button20220610)
  await fireEvent.click(button20220610)

  await fireEvent.click(clearButton)

  expect(emitted()['update:modelValue'][1]).toEqual([[]])
})
