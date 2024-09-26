import { Array, Context, Effect, Layer, Option, pipe } from 'effect'
import { Client } from 'typesense'
import type {
  DocumentSchema,
  SearchParams,
  SearchResponse,
  SearchResponseRequestParams,
} from 'typesense/lib/Typesense/Documents'
import type { MultiSearchRequestsSchema, MultiSearchResponse } from 'typesense/lib/Typesense/MultiSearch'
import type { ApolloError } from '@apollo/client/errors'
import { ApiService } from './ApiService'
import { GetArticleSearchKeyDocument } from '~/graphql-operations'
import { env } from '~/env'
import { decodeTypesenseErrorResponseOption } from '~/schema/typesense'

interface SearchInput {
  collection: string
  query: SearchParams
}
export interface TypesenseServiceImpl {
  search: <TReturn extends object>(input: SearchInput) => Effect.Effect<SearchResponse<TReturn>, Error>
  multiSearch: <TReturn extends DocumentSchema[]>(
    searchRequests: MultiSearchRequestsSchema,
  ) => Effect.Effect<MultiSearchResponse<TReturn>, Error>
}

export class TypesenseService extends Context.Tag('app/TypesenseService')<TypesenseService, TypesenseServiceImpl>() {}

export function createEmptyResponse<T extends DocumentSchema>(request: SearchResponseRequestParams): SearchResponse<T> {
  return {
    found: 0,
    out_of: 0,
    page: 1,
    request_params: request,
    search_time_ms: 0,
    hits: [],
  }
}

function make(client: Client) {
  return TypesenseService.of({
    search: <TReturn extends object>({ collection, query }: SearchInput) =>
      pipe(
        Effect.tryPromise({
          try: () => client.collections<TReturn>(collection).documents().search(query),
          catch: (err) => err as Error,
        }),
        Effect.map((response) =>
          Option.match(decodeTypesenseErrorResponseOption(response), {
            onSome: (error) => {
              if (error.code === 404) {
                return createEmptyResponse<TReturn>(query)
              } else {
                throw error
              }
            },
            onNone: () => response,
          }),
        ),
      ),
    multiSearch: <TReturn extends DocumentSchema[]>(searchRequests: MultiSearchRequestsSchema) =>
      pipe(
        Effect.tryPromise({
          try: () => client.multiSearch.perform<TReturn>(searchRequests),
          catch: (err) => err as Error,
        }),
        Effect.map(
          (response): MultiSearchResponse<TReturn> =>
            ({
              ...response,
              results: Array.map(
                response.results as SearchResponse<TReturn[number]>[],
                (searchResponse, index): MultiSearchResponse<TReturn>['results'][number] =>
                  Option.match(decodeTypesenseErrorResponseOption(searchResponse), {
                    onSome: (error): MultiSearchResponse<TReturn>['results'][number] => {
                      if (error.code === 404) {
                        return createEmptyResponse<TReturn[number]>(
                          searchRequests.searches[index],
                        ) as MultiSearchResponse<TReturn>['results'][number]
                      } else {
                        throw error
                      }
                    },
                    onNone: () => searchResponse as MultiSearchResponse<TReturn>['results'][number],
                  }),
              ),
            }) as MultiSearchResponse<TReturn>,
        ),
      ),
  })
}

export function provideTypesenseService(client: Client) {
  return Layer.succeed(TypesenseService, make(client))
}

export function provideTypesenseServiceFromApi(): Layer.Layer<TypesenseService, ApolloError, ApiService> {
  return Layer.effect(
    TypesenseService,
    pipe(
      ApiService,
      Effect.flatMap(({ query }) => {
        return query({
          query: GetArticleSearchKeyDocument,
          fetchPolicy: 'network-only',
        })
      }),
      Effect.map((resultOfSearchKey) => {
        const searchClient = new Client({
          nodes: [
            {
              host: env.VITE_TYPESENSE_DOMAIN,
              port: 443,
              protocol: 'https',
            },
          ],
          apiKey: resultOfSearchKey.data.articleSearchKey,
          connectionTimeoutSeconds: 5,
        })
        return make(searchClient)
      }),
    ),
  )
}
