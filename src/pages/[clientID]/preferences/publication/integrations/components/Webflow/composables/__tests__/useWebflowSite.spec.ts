import { beforeEach, expect, it } from 'vitest'
import { setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { useWebflowSite } from '../useWebflowSite'
import WebflowInfoMock from '~/mocks/graphql/WebflowInfo'
import { mockResponseOnce, setupApolloClient, setupTestPinia } from '~/test-helpers'

beforeEach(() => {
  setupApolloClient()
  setActivePinia(setupTestPinia())
})

it('should return webflow site api', async () => {
  const site = useWebflowSite()

  expect(site.loading.value).toBe(true)

  await until(site.loading).toBe(false)

  expect(site.loading.value).toBe(false)
  expect(site.domains.value).toMatchInlineSnapshot('[]')
  expect(site.sites.value).toMatchInlineSnapshot(`
    [
      {
        "customDomains": [
          {
            "id": "2",
            "url": "https://example.com",
          },
        ],
        "defaultDomain": "https://example.webflow.io",
        "displayName": "Example Site",
        "id": "1",
      },
    ]
  `)

  site.selectedSite.value = site.sites.value[0]

  expect(site.domains.value).toMatchInlineSnapshot(`
    [
      "https://example.com",
      "https://example.webflow.io",
    ]
  `)
})

it('should load selected site and domain from WebflowInfo query', async () => {
  mockResponseOnce(WebflowInfoMock, {
    webflowInfo: {
      site_id: '1',
      domain: 'https://example.com',
    },
  })

  const site = useWebflowSite()

  expect(site.loading.value).toBe(true)

  await until(site.loading).toBe(false)
  expect(site.loading.value).toBe(false)

  // flush watchEffect
  await flushPromises()

  expect(site.selectedSite.value).toMatchInlineSnapshot(`
    {
      "customDomains": [
        {
          "id": "2",
          "url": "https://example.com",
        },
      ],
      "defaultDomain": "https://example.webflow.io",
      "displayName": "Example Site",
      "id": "1",
    }
  `)
  expect(site.selectedDomain.value).toMatchInlineSnapshot('"https://example.com"')
})
