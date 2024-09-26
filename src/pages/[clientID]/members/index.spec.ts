import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import MembersPage from './index.vue'
import { mockResponseOnce, render, setupTestPinia } from '~/test-helpers'
import { useApolloClient } from '~/lib/apollo'
import GetSiteMock from '~/mocks/graphql/GetSite'
import { SubscriptionSetup } from '~/graphql-operations'

const pushRoute = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...(actual as Record<string, unknown>),
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
      push: pushRoute,
    })),
  }
})

const canSetupMember = ref(true)
const canAccessMember = ref(true)
vi.mock('~/composables/permission/publication', async () => {
  const actual = await vi.importActual('~/composables/permission/publication')
  return {
    ...(actual as Record<string, unknown>),
    usePublicationPermission: vi.fn(() => ({
      ready: computed(() => true),
      canSetupMember: computed(() => canSetupMember.value),
      canAccessMember: computed(() => canAccessMember.value),
    })),
  }
})

beforeEach(() => {
  setActivePinia(setupTestPinia())
  const { client } = useApolloClient()
  client.cache.reset()
})

describe('members setup status', () => {
  beforeEach(() => {
    pushRoute.mockClear()
  })

  it('user is Owner with setup undone', async () => {
    canSetupMember.value = true
    canAccessMember.value = true
    mockResponseOnce(GetSiteMock, {
      site: {
        subscription_setup: SubscriptionSetup.None,
      },
    })
    render(MembersPage, { props: { clientID: 'D6RX98VXN' } })
    await flushPromises()

    expect(pushRoute).toHaveBeenLastCalledWith('/D6RX98VXN/members/setup')
  })

  it('user is Admin with setup undone', async () => {
    canSetupMember.value = false
    canAccessMember.value = true
    mockResponseOnce(GetSiteMock, {
      site: {
        subscription_setup: SubscriptionSetup.WaitImport,
      },
    })
    render(MembersPage, { props: { clientID: 'D6RX98VXN' } })
    await flushPromises()

    expect(pushRoute).toHaveBeenLastCalledWith({
      name: 'clientID-articles-desks-deskSlug',
      params: {
        clientID: 'D6RX98VXN',
        deskSlug: 'all',
      },
    })
  })

  it('user is Owner with setup done', async () => {
    canSetupMember.value = true
    canAccessMember.value = true
    mockResponseOnce(GetSiteMock, {
      site: {
        subscription_setup: SubscriptionSetup.Done,
      },
    })
    render(MembersPage, { props: { clientID: 'D6RX98VXN' } })
    await flushPromises()

    expect(pushRoute).toBeCalledTimes(0)
  })

  it('user is Admin with setup done', async () => {
    canSetupMember.value = false
    canAccessMember.value = true
    mockResponseOnce(GetSiteMock, {
      site: {
        subscription_setup: SubscriptionSetup.Done,
      },
    })
    render(MembersPage, { props: { clientID: 'D6RX98VXN' } })
    await flushPromises()

    expect(pushRoute).not.toBeCalled()
  })
})
