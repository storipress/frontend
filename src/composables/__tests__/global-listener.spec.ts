import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { setActivePinia } from 'pinia'
import delay from 'delay'
import { vi } from 'vitest'
import type { GlobalListenerContext } from '../global-listener'
import {
  isAllowAccessWithoutAuth,
  useCheckAuthStatus,
  useGlobalListenerContext,
  useLoadUserInfo,
  useWorkspaceGuard,
} from '../global-listener'
import { useAuthStore } from '~/stores/auth'
import { useWorkspaceStore } from '~/stores/workspace'
import { useMeStore } from '~/stores/me'
import { setupTestPinia } from '~/test-helpers'
import { UserStatus } from '~/graphql-operations'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => reactive({ params: {} })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}))

vi.mock('@vueuse/router', () => ({
  useRouteParams: vi.fn(() => ref('')),
}))

describe('global Listener', () => {
  let mockAuthStore: ReturnType<typeof useAuthStore>
  let mockWorkspaceStore: ReturnType<typeof useWorkspaceStore>
  let mockMeStore: ReturnType<typeof useMeStore>
  let mockRouter: Router
  let mockRoute: RouteLocationNormalizedLoaded
  let mockContext: GlobalListenerContext
  let routeChangeEvent = createEventHook()
  let authStateChangeEvent = createEventHook()
  const clientIDChangeEvent = createEventHook()
  const triggerNotify = vi.fn()
  const onNotify = vi.fn()

  function setupMock(stubActions = true) {
    setActivePinia(setupTestPinia(stubActions))

    mockAuthStore = useAuthStore()
    mockWorkspaceStore = useWorkspaceStore()
    mockMeStore = useMeStore()
    mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
    } as unknown as Router
    mockRoute = {
      name: 'mock',
      path: '/',
      params: {
        clientID: 'clientID',
      },
      query: {},
      fullPath: '/clientID',
    } as unknown as RouteLocationNormalizedLoaded
    routeChangeEvent = createEventHook()
    authStateChangeEvent = createEventHook()
    mockContext = {
      authStore: mockAuthStore,
      workspaceStore: mockWorkspaceStore,
      meStore: mockMeStore,
      triggerNotify,
      onAuthStateChange: authStateChangeEvent.on,
      onRouteChange: routeChangeEvent.on,
      onClientIDChange: clientIDChangeEvent.on,
      route: mockRoute,
      router: mockRouter,
      onNotify,
    }
  }

  beforeEach(() => {
    setupMock()
  })

  describe('useGlobalListenerContext', () => {
    it('should return the correct context', () => {
      const context = useGlobalListenerContext()
      expect(context.authStore).toBeInstanceOf(Object)
      expect(context.meStore).toBeInstanceOf(Object)
      expect(context.workspaceStore).toBeInstanceOf(Object)
      expect(context.onAuthStateChange).toBeInstanceOf(Function)
      expect(context.onRouteChange).toBeInstanceOf(Function)
      expect(context.route).toBeInstanceOf(Object)
    })
  })

  describe('isAllowAccessWithoutAuth', () => {
    it('should return true for paths in the allow list', () => {
      expect(isAllowAccessWithoutAuth('/auth/login')).toBe(true)
      expect(isAllowAccessWithoutAuth('/auth/signup')).toBe(true)
      // Add more paths from the allow list as needed
    })

    it('should return false for paths not in the allow list', () => {
      expect(isAllowAccessWithoutAuth('/not/in/allow/list')).toBe(false)
    })
  })

  describe('useCheckAuthStatus', () => {
    it('should check token and handle route changes', () => {
      mockAuthStore.token = 'foo'

      useCheckAuthStatus(mockContext)

      expect(mockRouter.push).not.toBeCalled()
      expect(mockRouter.replace).not.toBeCalled()

      mockAuthStore.token = ''
      authStateChangeEvent.trigger(false)

      expect(mockRouter.replace).toBeCalledWith({ name: 'auth-login', query: { redirect: '/clientID' } })
    })

    it('should redirect to login if no auth', () => {
      mockAuthStore.token = 'foo'

      useCheckAuthStatus(mockContext)
      mockRoute.name = 'auth-login'
      routeChangeEvent.trigger({
        name: 'auth-login',
      })

      expect(mockRouter.replace).toBeCalledWith('/')

      vi.mocked(mockRouter.replace).mockReset()

      mockAuthStore.token = ''
      mockRoute.name = 'kanban'
      routeChangeEvent.trigger({
        name: 'kanban',
      })
      expect(mockRouter.replace).toBeCalledWith({ name: 'auth-login', query: { redirect: undefined } })

      vi.mocked(mockRouter.replace).mockReset()

      mockAuthStore.token = ''
      mockRoute.path = '/auth/signup'
      routeChangeEvent.trigger({
        name: 'auth-signup',
        path: '/auth/signup',
      })
      expect(mockRouter.replace).not.toBeCalled()
    })
  })

  describe('useWorkspaceGuard', () => {
    it('should handle auth changes and route changes', async () => {
      useWorkspaceGuard(mockContext)

      expect(mockWorkspaceStore.initialize).not.toBeCalled()

      authStateChangeEvent.trigger(true)
      await waitMutex()
      expect(mockWorkspaceStore.initialize).toBeCalled()

      routeChangeEvent.trigger({
        name: 'kanban',
        params: {
          clientID: 'clientID',
        },
      })

      await waitMutex()

      expect(mockContext.triggerNotify).toBeCalled()
      expect(mockRouter.replace).toBeCalledWith({
        name: 'workspaces',
      })

      vi.mocked(mockContext.triggerNotify).mockReset()
      vi.mocked(mockRouter.replace).mockReset()

      mockWorkspaceStore.workspaces = [
        {
          id: 'clientID',
          name: 'example',
          role: 'owner',
          status: UserStatus.Active,
          workspace: 'example',
          customer_site_domain: 'example.com',
        },
      ]

      routeChangeEvent.trigger({
        name: 'workspace-kanban',
        params: {
          clientID: 'clientID',
        },
      })

      await waitMutex()

      expect(mockRouter.push).not.toBeCalled()
      expect(mockRouter.replace).not.toBeCalled()
    })

    it('should handle workspaces is empty', async () => {
      mockWorkspaceStore.workspaces = []

      useWorkspaceGuard(mockContext)

      routeChangeEvent.trigger({
        name: 'workspace-kanban',
        params: {
          clientID: 'clientID',
        },
      })

      await waitMutex()

      expect(mockWorkspaceStore.initialize).toBeCalled()
    })
  })

  describe('useLoadUserInfo', () => {
    it('should handle auth changes and route changes', () => {
      useLoadUserInfo(mockContext)

      expect(mockMeStore.fetchMeEmail).not.toBeCalled()
      expect(mockMeStore.fetchMe).not.toBeCalled()

      authStateChangeEvent.trigger(true)
      expect(mockMeStore.fetchMeEmail).toBeCalled()
      expect(mockMeStore.fetchMe).not.toBeCalled()

      clientIDChangeEvent.trigger('')
      expect(mockMeStore.fetchMe).not.toBeCalled()

      clientIDChangeEvent.trigger('undefined')
      expect(mockMeStore.fetchMe).not.toBeCalled()

      clientIDChangeEvent.trigger('clientID')
      expect(mockMeStore.fetchMe).not.toBeCalled()

      clientIDChangeEvent.trigger('_')
      expect(mockMeStore.fetchMe).not.toBeCalled()

      clientIDChangeEvent.trigger('PXXXXXXXX')
      expect(mockMeStore.fetchMe).toBeCalled()
    })
  })
})

function waitMutex() {
  // because mutex will delay execute
  return delay(0)
}
