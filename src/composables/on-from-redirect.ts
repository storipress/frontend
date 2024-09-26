import { useRouteQuery } from '@vueuse/router'
import type { Promisable } from 'type-fest'

export function useFromRedirect() {
  const query = useRouteQuery('sp_from')

  return {
    isFromRedirect: computed(() => query.value === 'redirect'),
    clearRedirectFlag: () => {
      query.value = null
    },
  }
}

export function onFromRedirect(action: () => Promisable<void | false>) {
  const { isFromRedirect, clearRedirectFlag } = useFromRedirect()
  whenever(
    isFromRedirect,
    async () => {
      const res = await action()
      if (res === false) {
        return
      }
      clearRedirectFlag()
    },
    { immediate: true },
  )
}
