// must import from vitest, or will not be hoisted
import { vi } from 'vitest'
import { expect, it } from '@effect/vitest'
import type { SearchResponseRequestParams } from 'typesense/lib/Typesense/Documents'
import type { MultiSearchRequestsSchema } from 'typesense/lib/Typesense/MultiSearch'
import { Array, Effect, Layer, pipe } from 'effect'
import { TypesenseService, provideTypesenseService } from '../TypesenseService'

const mockClient = vi.hoisted(() => ({
  search: vi.fn((request: SearchResponseRequestParams) =>
    Promise.resolve({
      found: 0,
      out_of: 0,
      page: 1,
      request_params: request,
      search_time_ms: 0,
      hits: [],
    }),
  ),
  multiSearch: {
    perform: vi.fn((requests: MultiSearchRequestsSchema) =>
      Promise.resolve({
        results: Array.map(requests.searches, (request) => ({
          found: 0,
          out_of: 0,
          page: 1,
          request_params: request,
          search_time_ms: 0,
          hits: [],
        })),
      }),
    ),
  },
}))

vi.mock('typesense', () => ({
  Client: class Client {
    constructor() {
      return mockClient
    }
  },
}))

it.effect('can convert 404 to empty response', () => {
  mockClient.multiSearch.perform.mockResolvedValueOnce({
    results: [
      {
        code: 404,
        error: 'Not Found.',
      },
    ],
  } as any)

  return pipe(
    Effect.gen(function* () {
      const typesense = yield* TypesenseService
      const res = yield* typesense.multiSearch({ searches: [{}] })
      expect(res.results[0].hits).toEqual([])
    }),
    Effect.provide(
      Layer.unwrapEffect(
        pipe(
          Effect.promise(() => import('typesense')),
          Effect.map(({ Client }) => provideTypesenseService(new Client({ apiKey: 'key', nodes: [] }))),
        ),
      ),
    ),
  )
})
