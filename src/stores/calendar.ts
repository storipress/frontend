import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    currentIndex: undefined as number | undefined,
  }),
  actions: {
    setIndex(index: number) {
      this.currentIndex = index
    },
    resetIndex() {
      this.currentIndex = undefined
    },
  },
})
