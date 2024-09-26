import type { dayjs } from './dayjs'

export interface CalendarDate {
  date: string
  day: dayjs.Dayjs
  isCurrentWeek?: boolean
  isCurrentMonth?: boolean
  isNextMonth?: boolean
  isToday?: boolean
}

export function getWholeMonth(currentDay: dayjs.Dayjs, today: dayjs.Dayjs): CalendarDate[] {
  const daysInMonth = currentDay.daysInMonth()
  const firstDay = currentDay.date(1)
  const lastDay = currentDay.date(daysInMonth)

  const firstDayOfWeek = firstDay.day()
  const lastDayOfWeek = lastDay.day()

  const days: dayjs.Dayjs[] = []

  if (firstDayOfWeek === 0) {
    for (let i = 6; i > 0; i--) {
      days.push(firstDay.subtract(i, 'day'))
    }
  } else {
    // we are start at Monday
    for (let i = 1; i < firstDayOfWeek; i++) {
      days.push(firstDay.subtract(firstDayOfWeek - i, 'day'))
    }
  }

  for (let i = 0; i < daysInMonth; i++) {
    days.push(firstDay.add(i, 'day'))
  }

  for (let i = 0; i < 7 - lastDayOfWeek; i++) {
    days.push(lastDay.add(i + 1, 'day'))
  }

  return days.map((day) => ({
    day,
    date: day.format('YYYY-MM-DD'),
    isCurrentWeek: day.isSame(today, 'week'),
    isCurrentMonth: day.month() === currentDay.month(),
    // Only show the month name if it's the first day of the next month
    isNextMonth: day.month() === currentDay.month() + 1 && day.date() === 1,
    isToday: day.isSame(today, 'day'),
  }))
}
