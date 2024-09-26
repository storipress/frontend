import { describe, expect, it, vi } from 'vitest'
import { useMeTenantScopedMeta } from '..'

let metaResult = {}
let clientID = 'client_id'
const mutate = vi.fn().mockImplementation(() => Promise.resolve())

vi.mock('~/lib/apollo', () => ({
  useQuery() {
    return {
      result: ref({ me: { meta: JSON.stringify(metaResult) } }),
      loading: ref(false),
    }
  },
  useMutation() {
    return { mutate }
  },
}))

vi.mock('~/lib/client-id', () => ({
  useClientID() {
    return clientID
  },
}))

beforeEach(() => {
  metaResult = {}
  clientID = 'client_id'
  mutate.mockReset()
})

describe('useMeTenantScopedMeta', () => {
  it('useMeTenantScopedMeta should work', async () => {
    const { scopedMeta, setScopedMeta } = useMeTenantScopedMeta()
    expect(scopedMeta.value).toEqual({})
    await setScopedMeta({ foo: 'bar' })
    expect(mutate.mock.lastCall).toMatchInlineSnapshot(`
      [
        {
          "meta": "{"client_id":{"foo":"bar"}}",
        },
      ]
    `)
  })

  it('useMeTenantScopedMeta throws when no client id', async () => {
    clientID = ''
    expect(() => {
      useMeTenantScopedMeta()
    }).toThrowErrorMatchingInlineSnapshot(`[Error: clientID is not defined]`)
  })
})
