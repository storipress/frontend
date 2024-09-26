import { acceptHMRUpdate, defineStore } from 'pinia'

export const useLinterStore = defineStore('linter', () => {
  const issues = ref<Record<string, string>>({})

  return {
    issues,
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useLinterStore, import.meta.hot))
