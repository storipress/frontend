import { Context, Effect, Layer, Request, RequestResolver, pipe } from 'effect'
import type { MultiSearchRequestSchema } from 'typesense/lib/Typesense/MultiSearch'
import type { SearchResponse } from 'typesense/lib/Typesense/Documents'
import { TypesenseService } from '../services/TypesenseService'
import type { TypesenseArticleDocument } from '~/pages/[clientID]/articles/desks/components/Kanban/definition'

export interface TypesenseSearch
  extends Request.Request<SearchResponse<TypesenseArticleDocument>, Error>,
    MultiSearchRequestSchema {
  readonly _tag: 'TypenseSearch'
}

export const TypesenseSearchTag = Request.tagged<TypesenseSearch>('TypenseSearch')

export function makeRequest(request: MultiSearchRequestSchema): TypesenseSearch {
  return TypesenseSearchTag(request)
}

export const TypesenseSearchResolver = pipe(
  RequestResolver.makeBatched((requests: TypesenseSearch[]) =>
    pipe(
      TypesenseService,
      Effect.flatMap((typesense) => typesense.multiSearch<TypesenseArticleDocument[]>({ searches: requests })),
      Effect.flatMap((res) =>
        Effect.forEach(requests, (request, index) =>
          Request.completeEffect(request, Effect.succeed(res.results[index])),
        ),
      ),
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) => Request.completeEffect(request, Effect.fail(error))),
      ),
    ),
  ),
  RequestResolver.contextFromServices(TypesenseService),
)

export interface TypesenseSearchServiceImpl {
  search: (
    request: MultiSearchRequestSchema,
  ) => Effect.Effect<SearchResponse<TypesenseArticleDocument>, Error, TypesenseService>
}

export class TypesenseSearchService extends Context.Tag('app/TypesenseSearchService')<
  TypesenseSearchService,
  TypesenseSearchServiceImpl
>() {}

export function provideTypesenseSearchService(): Layer.Layer<TypesenseSearchService> {
  return Layer.succeed(
    TypesenseSearchService,
    TypesenseSearchService.of({
      search: (request: MultiSearchRequestSchema) => Effect.request(makeRequest(request), TypesenseSearchResolver),
    }),
  )
}
