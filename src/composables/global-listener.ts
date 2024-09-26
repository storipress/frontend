import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { Mutex } from 'async-mutex'
import { useRouteParams } from '@vueuse/router'
import { captureException } from '@sentry/vue'
import { useAuthStore } from '~/stores/auth'
import { useWorkspaceStore } from '~/stores/workspace'
import { useMeStore } from '~/stores/me'
import { checkClientIDFormat, isSpecialClientID } from '~/utils'

const allowListToAccessWithoutAuth = new Set([
  '/auth/login',
  '/auth/signup',
  '/auth/user-impersonate',
  '/auth/callback',
  '/auth/password/reset',
  '/auth/password/create',
  '/settings/auth/redirect',
])

export interface GlobalListenerContext {
  router: Router
  route: RouteLocationNormalizedLoaded
  authStore: ReturnType<typeof useAuthStore>
  workspaceStore: ReturnType<typeof useWorkspaceStore>
  meStore: ReturnType<typeof useMeStore>
  triggerNotify: (notify: { title: string; content?: string }) => void
  onRouteChange: (cb: (route: RouteLocationNormalizedLoaded) => void) => void
  onAuthStateChange: (cb: (isAuth: boolean) => void) => void
  onClientIDChange: (cb: (clientID: string | undefined) => void) => void
  onNotify: (cb: (notify: { title: string; content?: string }) => void) => void
}

export function useGlobalListenerContext(): GlobalListenerContext {
  const routeChangeEvent = createEventHook<RouteLocationNormalizedLoaded>()
  const authStateChangeEvent = createEventHook<boolean>()
  const clientIDChangeEvent = createEventHook<string | undefined>()
  const notifyEvent = createEventHook<{ title: string; content?: string }>()

  const route = useRoute()
  const clientID = useRouteParams<string>('clientID', '')

  const authStore = useAuthStore()
  nextTick(() => {
    watch(
      route,
      // ! We can't check clientID change here via `(value, oldValue) => ...` pattern here
      // route is a mutable object, thus, oldValue will also have current clientID
      (value) => {
        routeChangeEvent.trigger(value)
      },
      { deep: true, immediate: true },
    )

    watch(
      clientID,
      (value, oldValue) => {
        if (value !== oldValue) {
          clientIDChangeEvent.trigger(value)
        }
      },
      { immediate: true },
    )

    watch(
      () => authStore.isAuth,
      (value) => {
        authStateChangeEvent.trigger(value)
      },
      { immediate: true },
    )
  })

  return {
    router: useRouter(),
    route,
    authStore: useAuthStore(),
    workspaceStore: useWorkspaceStore(),
    meStore: useMeStore(),
    triggerNotify: notifyEvent.trigger,
    onRouteChange: routeChangeEvent.on,
    onAuthStateChange: authStateChangeEvent.on,
    onClientIDChange: clientIDChangeEvent.on,
    onNotify: notifyEvent.on,
  }
}

export function useCheckAuthStatus({
  authStore,
  onRouteChange,
  onAuthStateChange,
  route,
  router,
}: GlobalListenerContext): void {
  function checkToken() {
    const token = authStore.token
    const redirect = useStorage('redirect-path', '', sessionStorage)

    if (!token) {
      if (!allowListToAccessWithoutAuth.has(route.path)) {
        if (route.path === '/redirect') {
          redirect.value = route.fullPath
        }
        router.replace({ name: 'auth-login', query: { redirect: route.fullPath } })
      }
    }
  }

  checkToken()

  onAuthStateChange(checkToken)

  onRouteChange((value) => {
    if (authStore.isAuth) {
      if (route.name === 'auth-login') {
        router.replace('/')
      } else if (route.query.redirectTo === 'billing') {
        redirectToBilling()
      }
    } else if (!allowListToAccessWithoutAuth.has(route.path)) {
      router.replace({ name: 'auth-login', query: { ...value.query, redirect: value.fullPath } })
    }
  })
}

export function useWorkspaceGuard({
  authStore,
  onAuthStateChange,
  onRouteChange,
  router,
  workspaceStore,
  triggerNotify,
}: GlobalListenerContext) {
  const mux = new Mutex()

  onAuthStateChange((isAuth) => {
    mux.runExclusive(async () => {
      if (isAuth) {
        await workspaceStore.initialize()
      } else {
        workspaceStore.$reset()
      }
    })
  })

  onRouteChange(({ params: { clientID } }) => {
    // we focus to handle user enter a workspace not belong to him
    // there is no workspace if not login
    if (!authStore.isAuth) {
      return
    }
    // just want to make typescript happy
    if (Array.isArray(clientID) || !clientID) {
      return
    }

    if (isSpecialClientID(clientID)) {
      return
    }
    // this should ensure we won't send duplicate request
    mux.runExclusive(async () => {
      // maybe because just create publication
      if (!workspaceStore.workspaces || workspaceStore.workspaces.length === 0) {
        await workspaceStore.initialize()
      }
      const isOwnClientID = workspaceStore.workspaces?.some((item) => item.id === clientID)
      if (isOwnClientID) {
        return
      }

      triggerNotify({
        title: 'No permissions',
        content: 'You lack permission to publication or the publication does not exist.',
      })
      router.replace({ name: 'workspaces' })
    })
  })
}

export function useLoadUserInfo({ authStore, meStore, onAuthStateChange, onClientIDChange }: GlobalListenerContext) {
  onAuthStateChange((isAuth) => {
    if (isAuth) {
      meStore.fetchMeEmail()
    } else {
      meStore.$reset()
    }
  })

  onClientIDChange((clientID) => {
    if (!authStore.isAuth) {
      return
    }
    if (!clientID) {
      return
    }
    if (isSpecialClientID(clientID)) {
      return
    }
    if (!checkClientIDFormat(clientID)) {
      captureException(new Error('Client ID is incorrect'))
      return
    }
    meStore.fetchMe()
  })
}

export function useListenGlobalEvent(context = useGlobalListenerContext()) {
  useCheckAuthStatus(context)
  useWorkspaceGuard(context)
  useLoadUserInfo(context)
  return context
}

async function redirectToBilling(router: Router = useRouter()) {
  const workspaceStore = useWorkspaceStore()
  await workspaceStore.reInitialize()
  const clientId = workspaceStore.workspaces?.find((workspace) => workspace.role === 'owner')?.id

  return clientId ? router.replace(`/${clientId}/account/billing`) : router.replace('/workspaces')
}

export function isAllowAccessWithoutAuth(url: string) {
  return allowListToAccessWithoutAuth.has(url)
}
