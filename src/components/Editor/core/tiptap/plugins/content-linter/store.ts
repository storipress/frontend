import { defineStore } from 'pinia'

export const useAskedContentStore = defineStore('askedContentStore', () => {
  const paragraphRecord = new Set()
  const spellCheckRecord = new Set()
  return {
    paragraphRecord,
    spellCheckRecord,
  }
})
