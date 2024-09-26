import { expect, it } from 'vitest'
import { $URL, withQuery } from 'ufo'
import type { RawResponse } from '../social-connect'
import { normalizeResponse, parseResponse } from '../social-connect'

vi.mock('@sentry/vue', () => ({
  captureException: vi.fn(),
}))

it.each([
  [{ ok: '1' }, { ok: '1' }],
  [
    { code: '123', message: 'error' },
    { code: 123, message: 'error' },
  ],
  [{ response: '[]' }, { response: '[]' }],
])('can parse response `%s`', (queries, expected) => {
  expect(parseResponse(new $URL(withQuery('/', queries)))).toEqual(expected)
})

it.each([
  [{ ok: '1' }, { ok: true }],
  [
    { code: 123, message: 'error' },
    { ok: false, code: 123, message: 'error' },
  ],
  [{ response: '[]' }, { ok: true }],
  [{ response: '{"error": "foo"}' }, { ok: false, code: -1, message: 'foo' }],
  [{ response: '{' }, { ok: false, code: -1, message: 'unknown response', _raw: { response: '{' } }],
])('can normalize response `%s`', (queries, expected) => {
  expect(normalizeResponse(queries as unknown as RawResponse)).toEqual(expected)
})

it('will send sentry error for invalid message', async () => {
  const { captureException } = await import('@sentry/vue')

  normalizeResponse({ response: '[', _raw: { response: '{' } })

  expect(captureException).toHaveBeenCalled()
})
