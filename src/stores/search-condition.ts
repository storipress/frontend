import { acceptHMRUpdate, defineStore } from 'pinia'
import type { SearchDataInterface } from '~/components/Navbar'

export const useSearchConditionStore = defineStore('search-condition', {
  state: () =>
    ({
      text: undefined,
      people: undefined,
      tags: undefined,
      range: undefined,
      desks: undefined,
      plans: undefined,
      persist: false,
    }) as SearchDataInterface,
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSearchConditionStore, import.meta.hot))
