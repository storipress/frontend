import { acceptHMRUpdate, defineStore } from 'pinia'
import { dayjs } from '~/lib/dayjs'

export const useSchedulerStore = defineStore('scheduler', {
  state: () => {
    const today = dayjs()

    return {
      timezone: 'UTC',
      currentDay: today,
      rangeStart: today.startOf('month').toDateTimeString(),
      rangeEnd: today.endOf('month').toDateTimeString(),
      scheduledAt: undefined as string | undefined,
    }
  },
  getters: {
    range(state) {
      return { from: state.rangeStart, to: state.rangeEnd }
    },
  },
  actions: {
    parseDate(dateString: string | Date) {
      return dayjs(dateString).tz(this.timezone)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSchedulerStore, import.meta.hot))
}
