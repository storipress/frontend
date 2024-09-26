import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

export function useApolloClientID(route = useCurrentRoute()): string {
  const store = useAuthStore()
  return (route?.params?.clientID as string) || store.clientID || store.defaultClientID
}

export function useClientID(route?: RouteLocationNormalizedLoaded): string {
  const clientID = useApolloClientID(route)
  if (clientID === 'default' || clientID === '_') {
    return ''
  }
  return clientID
}

function useCurrentRoute() {
  if (getCurrentInstance()) {
    return useRoute()
  }
  return null
}
