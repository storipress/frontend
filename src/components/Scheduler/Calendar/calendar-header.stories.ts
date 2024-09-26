import { h } from 'vue'
import { dayjs } from '../ArticleCard/dayjs'
import CalendarHeader from './calendar-header.vue'

export default {
  title: 'Schedule/Calendar/CalendarHeader',
  component: CalendarHeader,
}

export function Default(args, { argTypes }) {
  return {
    props: Object.keys(argTypes),
    setup() {
      return () => h(CalendarHeader, args)
    },
  }
}

Default.args = {
  day: dayjs('2020-01-01'),
}
