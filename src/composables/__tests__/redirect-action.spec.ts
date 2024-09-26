import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter, useRouter } from 'vue-router'
import { useConditionAction, useConditionRedirectAction, useHomePage, useRedirection } from '../redirect-action'

const Noop = defineComponent(() => {
  return () => h('div')
})

// create a mock router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: Noop,
    },
    {
      path: '/target',
      component: Noop,
    },
  ],
})

vi.mock('vue-router', async () => ({
  ...(await vi.importActual('vue-router')),
  useRouter: () => router,
  useRoute: () => ({ params: { clientID: '123' } }),
}))

beforeEach(() => {
  const router = useRouter()
  router.replace('/')
})

describe('redirect-action', () => {
  it('useConditionRedirectAction', async () => {
    const shouldRedirect = ref(false)
    const target = ref('/target')
    const router = useRouter()
    const spy = vi.spyOn(router, 'push')

    useConditionRedirectAction({ shouldRedirect, target })

    // verify init state
    expect(shouldRedirect.value).toBe(false)

    // ensure updating will trigger redirect
    shouldRedirect.value = true
    await nextTick()
    expect(spy).toHaveBeenCalledWith('/target')
  })

  it('useRedirection', async () => {
    const target = ref('/target')
    const redirect = useRedirection({ target })

    // verify init state
    expect(router.currentRoute.value.path).not.toBe('/target')

    // execute redirect and ensure success
    await redirect()
    expect(router.currentRoute.value.path).toBe('/target')
  })

  it('useConditionAction', async () => {
    const trigger = ref(false)
    const action = vi.fn()
    useConditionAction({ trigger, action })

    // verify initial state
    expect(trigger.value).toBe(false)
    expect(action).not.toHaveBeenCalled()

    // ensure trigger action
    trigger.value = true
    await nextTick()
    expect(action).toHaveBeenCalled()
  })

  it('useHomePage', () => {
    const homePage = useHomePage()

    // verify return homepage url
    expect(homePage()).toBe('/123/articles/desks/all')
  })
})
