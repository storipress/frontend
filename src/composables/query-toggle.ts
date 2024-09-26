import { useRouteQuery } from '@vueuse/router'

export function useQueryToggle({ key, value, syncWith }: { key: string; value?: string; syncWith?: Ref<boolean> }) {
  const query = useRouteQuery<string | null>(key, null)
  const queryToggle = computed({
    get() {
      if (!value) {
        return Boolean(typeof query.value === 'string' || query.value)
      }
      return query.value === value
    },
    set(v) {
      if (query.value && query.value !== value) return

      if (!v) {
        query.value = null
        return
      }

      if (value) {
        query.value = value
      } else {
        query.value = 'true'
      }
    },
  })

  if (syncWith) {
    syncRef(queryToggle, syncWith, { immediate: false })
    // Manually do the first sync to ensure we'll prefer the query value
    syncWith.value = queryToggle.value
  }

  return {
    value: queryToggle,
  }
}
