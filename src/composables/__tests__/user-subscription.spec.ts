import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUserSubscription } from '../user-subscription'
import { enableFeatures, mockResponseOnce, setupTestPinia } from '~/test-helpers'
import { useApolloClient } from '~/lib/apollo'
import GetMeMock from '~/mocks/graphql/GetMe'
import GetSiteMock from '~/mocks/graphql/GetSite'

beforeEach(() => {
  setActivePinia(setupTestPinia())
  const { client } = useApolloClient()
  client.cache.reset()
})

describe('useUserSubscription', () => {
  it('should return correct computed properties', async () => {
    const { onTrial, isPlusPlan, isOwner, onTrialFree, canAccessAllPlusFeatures } = useUserSubscription()

    await until(onTrial).not.toBeUndefined()

    expect(onTrial.value).toBe(false)
    expect(isPlusPlan.value).toBe(true)
    expect(isOwner.value).toBe(false)
    expect(onTrialFree.value).toBe(false)
    expect(canAccessAllPlusFeatures.value).toBe(true)
  })

  it('should return correct isOwner', async () => {
    mockResponseOnce(GetMeMock, {
      me: {
        role: 'owner',
      },
    })

    const { onTrial, isPlusPlan, isOwner, onTrialFree, canAccessAllPlusFeatures } = useUserSubscription()

    await until(onTrial).not.toBeUndefined()

    expect(onTrial.value).toBe(false)
    expect(isPlusPlan.value).toBe(true)
    expect(isOwner.value).toBe(true)
    expect(onTrialFree.value).toBe(false)
    expect(canAccessAllPlusFeatures.value).toBe(true)
  })

  it('should return correct plus plan for AppSumo black friday tier', async () => {
    mockResponseOnce(GetSiteMock, {
      site: {
        plan: 'storipress_bf_tier3',
      },
    })

    const { onTrial, isPlusPlan, isOwner, onTrialFree, canAccessAllPlusFeatures } = useUserSubscription()

    await until(onTrial).not.toBeUndefined()

    expect(onTrial.value).toBe(false)
    expect(isPlusPlan.value).toBe(true)
    expect(isOwner.value).toBe(false)
    expect(onTrialFree.value).toBe(false)
    expect(canAccessAllPlusFeatures.value).toBe(true)
  })

  it('use Feature Flag > ForcePlusPlan to control the status of the Plus plan', async () => {
    mockResponseOnce(GetSiteMock, {
      site: {
        plan: 'storipress_bf_tier1',
      },
    })
    enableFeatures(['force-plus-plan'])

    const { onTrial, isPlusPlan, isOwner, onTrialFree, canAccessAllPlusFeatures } = useUserSubscription()

    await until(onTrial).not.toBeUndefined()

    expect(onTrial.value).toBe(false)
    expect(isPlusPlan.value).toBe(true)
    expect(isOwner.value).toBe(false)
    expect(onTrialFree.value).toBe(false)
    expect(canAccessAllPlusFeatures.value).toBe(true)
  })
})
