import type { ApolloError, ApolloQueryResult, OperationVariables, QueryOptions } from '@apollo/client/core'
import { Context, Effect, Layer } from 'effect'
import type { ApiClient } from '~/api/client'

export interface ApiServiceImpl {
  query: <TReturn, TVariables extends OperationVariables>(
    opt: QueryOptions<TVariables, TReturn>,
  ) => Effect.Effect<ApolloQueryResult<TReturn>, ApolloError>
}

export class ApiService extends Context.Tag('app/ApiService')<ApiService, ApiServiceImpl>() {}

export function provideApiService(client: ApiClient) {
  return Layer.succeed(ApiService, {
    query(opt) {
      return Effect.tryPromise({
        try: () => client.query(opt),
        catch: (err) => err as ApolloError,
      })
    },
  })
}
