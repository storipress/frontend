import { beforeEach, expect, it } from 'vitest'
import { setActivePinia } from 'pinia'
import { ChoosePublicationAction, useChoosePublicationAction, useDetectAction } from '../use-choose-publication-action'
import { setupTestPinia } from '~/test-helpers'
import { RedirectTarget } from '~/composables'

let route = { query: {} }
const pushRoute = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({
    push: pushRoute,
    replace: pushRoute,
  }),
}))

beforeEach(() => {
  route = { query: {} }
  setActivePinia(setupTestPinia())
  pushRoute.mockClear()
})

it('can detect action from route', () => {
  expect(useDetectAction()).toBe(null)

  route = { query: { integration: 'webflow' } }
  expect(useDetectAction()).toBe(ChoosePublicationAction.Webflow)

  route = { query: { integration: 'webflow', to: RedirectTarget.Integration, sp_from: 'redirect' } }
  expect(useDetectAction()).toBe(ChoosePublicationAction.Webflow)

  route = { query: { to: RedirectTarget.Integration, sp_from: 'redirect' } }
  expect(useDetectAction()).toBe(ChoosePublicationAction.Integration)

  route = { query: { to: RedirectTarget.CreateNewArticle, sp_from: 'redirect' } }
  expect(useDetectAction()).toBe(ChoosePublicationAction.Other)
})

it('will return original value if not detect action', () => {
  const { handleAction, hasAction, includeTabs, message } = useChoosePublicationAction(null)
  expect(message.value).toMatchInlineSnapshot('"My Publications"')
  expect(includeTabs.value).toBe(null)
  expect(hasAction.value).toBe(false)

  const navigate = vi.fn()
  const event = new Event('click')
  const preventDefault = vi.spyOn(event, 'preventDefault')
  handleAction({ event, clientId: 'client_id', navigate })

  expect(preventDefault).not.toBeCalled()
  expect(navigate).toBeCalled()
})

it('will return handler for webflow action', () => {
  const { handleAction, hasAction, includeTabs, message } = useChoosePublicationAction(ChoosePublicationAction.Webflow)
  expect(message.value).toMatchInlineSnapshot('"Choose a publication to connect Webflow integration"')
  expect(includeTabs.value).toEqual(['owner', 'admin'])
  expect(hasAction.value).toBe(true)

  const navigate = vi.fn()
  const event = new Event('click')
  const preventDefault = vi.spyOn(event, 'preventDefault')
  handleAction({ event, clientId: 'client_id', navigate })

  expect(preventDefault).toBeCalled()
  expect(navigate).not.toBeCalled()

  // after click will restore to default state
  expect(hasAction.value).toBe(false)
})

it('will return handler for integration action', () => {
  route = { query: { to: RedirectTarget.Integration, sp_from: 'redirect' } }

  const { handleAction, hasAction, includeTabs, message } = useChoosePublicationAction()
  expect(message.value).toMatchInlineSnapshot('"Choose a publication to continue the process"')
  expect(includeTabs.value).toEqual(['owner', 'admin'])
  expect(hasAction.value).toBe(true)

  const navigate = vi.fn()
  const event = new Event('click')
  const preventDefault = vi.spyOn(event, 'preventDefault')
  handleAction({ event, clientId: 'client_id', navigate })

  expect(preventDefault).toBeCalled()
  expect(navigate).not.toBeCalled()
  expect(pushRoute).toBeCalledWith({
    path: '/redirect',
    query: {
      to: RedirectTarget.Integration,
      client_id: 'client_id',
      sp_from: 'workspaces',
    },
  })

  // after click will restore to default state
  expect(hasAction.value).toBe(false)
})

it('will return handler for shopify action', () => {
  route = { query: { integration: 'shopify', sp_from: 'redirect' } }
  const { handleAction, hasAction, includeTabs, message } = useChoosePublicationAction(ChoosePublicationAction.Shopify)
  expect(message.value).toMatchInlineSnapshot(`"Choose a publication to connect Shopify integration"`)
  expect(includeTabs.value).toEqual(['owner', 'admin'])
  expect(hasAction.value).toBe(true)

  const navigate = vi.fn()
  const event = new Event('click')
  const preventDefault = vi.spyOn(event, 'preventDefault')
  handleAction({ event, clientId: 'client_id', navigate })

  expect(preventDefault).toBeCalled()
  expect(navigate).not.toBeCalled()
  expect(pushRoute).toBeCalledWith({
    path: '/redirect',
    query: {
      to: RedirectTarget.Integration,
      integration: 'shopify',
      client_id: 'client_id',
      sp_from: 'workspaces',
    },
  })

  // after click will restore to default state
  expect(hasAction.value).toBe(false)
})

it('will return handler for other action', () => {
  route = { query: { to: RedirectTarget.CreateNewArticle, sp_from: 'redirect' } }

  const { handleAction, hasAction, includeTabs, message } = useChoosePublicationAction()
  expect(message.value).toMatchInlineSnapshot('"Choose a publication to continue the process"')
  expect(includeTabs.value).toEqual(null)
  expect(hasAction.value).toBe(true)

  const navigate = vi.fn()
  const event = new Event('click')
  const preventDefault = vi.spyOn(event, 'preventDefault')
  handleAction({ event, clientId: 'client_id', navigate })

  expect(preventDefault).toBeCalled()
  expect(navigate).not.toBeCalled()
  expect(pushRoute).toBeCalledWith({
    path: '/redirect',
    query: {
      to: RedirectTarget.CreateNewArticle,
      client_id: 'client_id',
      sp_from: 'workspaces',
    },
  })

  // after click will restore to default state
  expect(hasAction.value).toBe(false)
})
