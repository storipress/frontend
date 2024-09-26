import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { EMPTY_STATISTICS } from './constants'
import { getImageReadSeconds, getTotalReadMinute, getWordReadSeconds } from './read-time'
import type { WordStatistics } from './types'

export interface State {
  statistics: WordStatistics
}

export const useWordCount = defineStore('wordCount', () => {
  const statistics = ref(EMPTY_STATISTICS)

  const imageReadTime = computed(() => {
    return getImageReadSeconds(statistics.value.images)
  })

  const readTime = computed(() => {
    const wordSeconds = getWordReadSeconds(statistics.value.words)
    return getTotalReadMinute(wordSeconds, imageReadTime.value)
  })

  return {
    statistics,
    imageReadTime,
    readTime,

    SET_STATISTICS(stat: WordStatistics) {
      statistics.value = stat
    },
  }
})
