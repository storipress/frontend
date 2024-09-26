import { vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import type * as Analytics from '../analytics'
import { useAuthStore } from '~/stores/auth'

it('enhanceProperties will add groupId', async () => {
  const pinia = createTestingPinia({
    initialState: {
      auth: {
        clientID: '',
      },
    },
  })
  setActivePinia(pinia)
  const { getTrackContext } = await vi.importActual<typeof Analytics>('../analytics')

  expect(getTrackContext()).toMatchInlineSnapshot('{}')

  const store = useAuthStore()
  store.clientID = 'test'

  expect(getTrackContext()).toMatchInlineSnapshot(`
    {
      "groupId": "test",
    }
  `)
})

describe('normalizeUTM', async () => {
  const { normalizeUTM } = await vi.importActual<typeof Analytics>('../analytics')

  it('basic', () => {
    expect(
      normalizeUTM({
        utm_source: 'source',
        utm_medium: 'medium',
        utm_campaign: 'name',
        utm_content: 'content',
        utm_term: 'term',
      }),
    ).toMatchInlineSnapshot(`
    {
      "content": "content",
      "medium": "medium",
      "name": "name",
      "source": "source",
      "term": "term",
    }
  `)
  })

  it('not affect by other query', () => {
    expect(
      normalizeUTM({
        sp_from: 'redirect',
      }),
    ).toMatchInlineSnapshot('undefined')
  })

  it('ensure it is using value correctly', () => {
    expect(
      normalizeUTM({
        utm_source: 'source-value',
        utm_medium: 'medium-value',
        utm_campaign: 'name-value',
        utm_content: 'content-value',
        utm_term: 'term-value',
      }),
    ).toMatchInlineSnapshot(`
    {
      "content": "content-value",
      "medium": "medium-value",
      "name": "name-value",
      "source": "source-value",
      "term": "term-value",
    }
  `)
  })

  it('mixed utm and other query', () => {
    expect(
      normalizeUTM({
        utm_source: 'source-value',
        utm_medium: 'medium-value',
        utm_campaign: 'name-value',
        utm_content: 'content-value',
        utm_term: 'term-value',
        sp_from: 'redirect',
      }),
    ).toMatchInlineSnapshot(`
    {
      "content": "content-value",
      "medium": "medium-value",
      "name": "name-value",
      "source": "source-value",
      "term": "term-value",
    }
  `)
  })
})
