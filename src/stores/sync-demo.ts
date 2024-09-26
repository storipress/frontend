import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSyncDemoStore = defineStore('sync-demo', { state: () => ({ counter: 0 }), sync: { enabled: true } })

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSyncDemoStore, import.meta.hot))
