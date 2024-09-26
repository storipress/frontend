import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { Integrations, useIntegrationUtils } from '../integration'
import { mockResponseOnce, setupTestPinia } from '~/test-helpers'
import { useApolloClient } from '~/lib/apollo'
import ListIntegrationsMock from '~/mocks/graphql/ListIntegrations'

beforeEach(() => {
  setActivePinia(setupTestPinia())
  const { client } = useApolloClient()
  client.cache.reset()
})

describe('useIntegrationUtils', () => {
  it('integration is activated', async () => {
    mockResponseOnce(ListIntegrationsMock, {
      integrations: [
        {
          key: 'disqus',
          data: '{"shortname":"storipress-integration-test"}',
          activated_at: null,
        },
      ],
    })

    const { loadingListIntegration, getActivateTime } = useIntegrationUtils()

    await until(loadingListIntegration).not.toBeTruthy()

    expect(getActivateTime(Integrations.Disqus).value).toBe(null)
  })

  it('get parse data', async () => {
    mockResponseOnce(ListIntegrationsMock, {
      integrations: [
        {
          key: 'disqus',
          data: '{"shortname":"storipress-integration-test"}',
          activated_at: null,
        },
      ],
    })

    const { loadingListIntegration, getParseData } = useIntegrationUtils()

    expect(getParseData(Integrations.Disqus).value).toBeNull()

    await until(loadingListIntegration).not.toBeTruthy()

    expect(getParseData(Integrations.Disqus).value).toEqual({
      shortname: 'storipress-integration-test',
    })
    expect(getParseData(Integrations.Facebook).value).toEqual([])
  })

  it('get third-party data', () => {
    const { getThirdPartyData, getParseData } = useIntegrationUtils()

    expect(getThirdPartyData(Integrations.LinkedIn).value).toEqual(getParseData(Integrations.LinkedIn).value)

    expect(getThirdPartyData(Integrations.Webflow).value).toEqual(getParseData(Integrations.Webflow).value)

    expect(getThirdPartyData(Integrations.Facebook).value).toEqual(getParseData(Integrations.Facebook).value)

    expect(getThirdPartyData(Integrations.Twitter).value).toEqual(getParseData(Integrations.Twitter).value)

    expect(getThirdPartyData(Integrations.Slack).value).toEqual(getParseData(Integrations.Slack).value)

    expect(getThirdPartyData(Integrations.Shopify).value).toEqual(getParseData(Integrations.Shopify).value)
  })
})

it.each([
  ['a', true],
  [1, true],
  [true, true],
  [[], false],
  [null, false],
  [undefined, false],
  [{}, false],
  [{ a: 1 }, true],
])('isIntegrationConnectedWithData can validate data', (data, expected) => {
  const { isIntegrationConnectedWithData } = useIntegrationUtils()

  expect(isIntegrationConnectedWithData(data)).toBe(expected)
})

it.each([
  [Integrations.LinkedIn, false],
  [Integrations.Facebook, false],
  [Integrations.Webflow, false],
])('third-party not enabled', async (key, expected) => {
  mockResponseOnce(ListIntegrationsMock, {
    integrations: [
      {
        key: 'linkedin',
        data: '{"id":"storipress-integration-test"}',
        configuration: {
          id: 'storipress-integration-test222',
          name: 'storipress',
          authors: [],
          __typename: 'LinkedInConfiguration',
        },
        activated_at: null,
      },
      {
        key: 'webflow',
        data: '[]',
        configuration: null,
        activated_at: '2023-07-06T09:52:06+00:00',
      },
      {
        key: 'facebook',
        data: '[]',
        configuration: null,
        activated_at: '2023-07-06T09:52:06+00:00',
      },
    ],
  })

  const { isReady, isThirdPartyEnabled } = useIntegrationUtils()

  await until(isReady).toBeTruthy()

  expect(isThirdPartyEnabled(key).value).toBe(expected)
})

it.each([
  [Integrations.LinkedIn, true],
  [Integrations.Twitter, true],
  [Integrations.Webflow, true],
])('third-party enabled', async (key, expected) => {
  mockResponseOnce(ListIntegrationsMock, {
    integrations: [
      {
        key: 'linkedin',
        data: '{"id":"storipress-integration-test"}',
        configuration: {
          id: 'storipress-integration-test111',
          name: 'storipress',
          authors: [],
          __typename: 'LinkedInConfiguration',
        },
        activated_at: '2023-07-06T09:52:06+00:00',
      },
      {
        key: 'webflow',
        data: '[]',
        configuration: {
          name: 'storipress',
          email: 'test@storipress.com',
          user_id: 'storipress',
          __typename: 'WebflowConfiguration',
        },
        activated_at: '2023-07-06T09:52:06+00:00',
      },
      {
        key: 'twitter',
        data: '{"name":"storipress-integration-test"}',
        configuration: null,
        activated_at: '2023-07-06T09:52:06+00:00',
      },
    ],
  })

  const { loadingListIntegration, isThirdPartyEnabled } = useIntegrationUtils()

  await until(loadingListIntegration).not.toBeTruthy()

  expect(isThirdPartyEnabled(key).value).toBe(expected)
})

it.each([
  [
    { key: Integrations.LinkedIn, referrer: undefined },
    'https://api.storipress.dev/partners/linkedin/connect?api-token=cAA6LoWllmqdXaYYid1AxpEDy5liOBGp5ppKPNKM&client_id=undefined',
  ],
  [
    { key: Integrations.Twitter, referrer: undefined },
    'https://api.storipress.dev/client/undefined/twitter/connect?api-token=cAA6LoWllmqdXaYYid1AxpEDy5liOBGp5ppKPNKM',
  ],
  [
    { key: Integrations.Shopify, referrer: 'integration' as const },
    'https://api.storipress.dev/partners/shopify/connect?client_id=undefined&api-token=cAA6LoWllmqdXaYYid1AxpEDy5liOBGp5ppKPNKM&referrer=integration',
  ],
])('get third-party connect api', async ({ key, referrer }, expected) => {
  mockResponseOnce(ListIntegrationsMock, {
    integrations: [
      {
        key: 'linkedin',
        data: '[]',
        configuration: null,
        activated_at: null,
      },
      {
        key: 'shopify',
        data: '[]',
        configuration: null,
        activated_at: null,
      },
      {
        key: 'twitter',
        data: '[]',
        configuration: null,
        activated_at: null,
      },
    ],
  })

  const { loadingListIntegration, getThirdPartyApi } = useIntegrationUtils()

  await until(loadingListIntegration).not.toBeTruthy()

  expect(getThirdPartyApi(key, referrer)).toBe(expected)
})

it.each([
  [
    { key: Integrations.LinkedIn, referrer: undefined },
    'https://api.storipress.dev/partners/linkedin/disconnect?api-token=cAA6LoWllmqdXaYYid1AxpEDy5liOBGp5ppKPNKM&client_id=undefined',
  ],
  [
    { key: Integrations.Twitter, referrer: undefined },
    'https://api.storipress.dev/client/undefined/twitter/disconnect?api-token=cAA6LoWllmqdXaYYid1AxpEDy5liOBGp5ppKPNKM',
  ],
  [
    { key: Integrations.Shopify, referrer: 'integration' as const },
    'https://api.storipress.dev/partners/shopify/disconnect?client_id=undefined&api-token=cAA6LoWllmqdXaYYid1AxpEDy5liOBGp5ppKPNKM&referrer=integration',
  ],
])('get third-party disconnect api', async ({ key, referrer }, expected) => {
  mockResponseOnce(ListIntegrationsMock, {
    integrations: [
      {
        key: 'linkedin',
        data: '{"id":"storipress-integration-test"}',
        configuration: {
          id: 'storipress-integration-test333',
          name: 'storipress',
          authors: [],
          __typename: 'LinkedInConfiguration',
        },
        activated_at: null,
      },
      {
        key: 'shopify',
        data: '{"id":"storipress-integration-test"}',
        configuration: null,
        activated_at: null,
      },
      {
        key: 'twitter',
        data: '{"id":"storipress-integration-test"}',
        configuration: null,
        activated_at: null,
      },
    ],
  })

  const { loadingListIntegration, getThirdPartyApi } = useIntegrationUtils()

  await until(loadingListIntegration).not.toBeTruthy()

  expect(getThirdPartyApi(key, referrer)).toBe(expected)
})
