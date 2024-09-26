import type { ComputedRef } from 'vue'
import { useAuthStore } from '~/stores/auth'

export function useClientIDMap<T>(callback: () => ComputedRef<T>) {
  const mapClientIDToComputedRef = new Map<string, ComputedRef<T>>()
  const store = useAuthStore()
  return computed(() => {
    let res = mapClientIDToComputedRef.get(store.clientID)
    if (!res) {
      res = callback()
      mapClientIDToComputedRef.set(store.clientID, res)
    }

    return res.value
  })
}
