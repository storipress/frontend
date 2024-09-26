import type { Context } from 'effect'
import { Array, Effect, HashMap, HashSet, Number, Option, Ref, Schedule, pipe } from 'effect'
import { refWithControl } from '@vueuse/core'
import type { WritableDeep } from 'type-fest'
import { max } from 'lodash-es'
import invariant from 'tiny-invariant'
import type { StageQueryResult, TypesenseArticleDocument } from '../definition'
import type { SortArticleBy } from '../search-query-provider'
import { createSortBy } from '../search-query-provider'
import * as LocalDocument from './LocalDocument'
import * as ArticleIndex from './ArticleIndex'
import * as SourceArticleIndex from './SourceArticleIndex'
import { arrayAppendOrReplace, parseStageKey } from './utils'
import { TypesenseService, provideTypesenseServiceFromApi } from '~/effects/services/TypesenseService'
import { TypesenseSearchService, provideTypesenseSearchService } from '~/effects/requests/TypesenseRequests'
import type { ApiService } from '~/effects/services/ApiService'

function withDefaultRetry<R, E, A>(effect: Effect.Effect<R, E, A>): Effect.Effect<R, never, A> {
  return pipe(effect, Effect.retry(Schedule.intersect(Schedule.recurs(2), Schedule.fixed(500))), Effect.orDie)
}

export interface DocumentWithIndex {
  index: SourceArticleIndex.SourceArticleIndex
  document: TypesenseArticleDocument
}

export interface DocumentWithPivot extends DocumentWithIndex {
  pivot: string
}

export interface DocumentWithOriginPosition extends DocumentWithIndex {
  pivot?: string
  origin: SourceArticleIndex.SourceArticleIndex
}

export class ArticleDataSource {
  sourceQueryRef = refWithControl<StageQueryResult[]>([])
  isDragging = false

  constructor(
    readonly typesenseService: Context.Tag.Service<TypesenseService>,
    public localSource: Ref.Ref<LocalDocument.LocalDocument>,
    public source: Ref.Ref<StageQueryResult[]>,
    initialSource: StageQueryResult[] = [],
  ) {
    this.sourceQueryRef.value = initialSource
  }
}

export function make(): Effect.Effect<ArticleDataSource, never, TypesenseService> {
  return pipe(
    Effect.all([TypesenseService, Ref.make(LocalDocument.empty()), Ref.make([] as StageQueryResult[])]),
    Effect.map(([client, localDocument, stageQuery]) => new ArticleDataSource(client, localDocument, stageQuery)),
  )
}

export function makeFromApi(): Effect.Effect<ArticleDataSource, never, ApiService> {
  return pipe(make(), Effect.provide(provideTypesenseServiceFromApi()), withDefaultRetry)
}

export function refreshBatchByStageKeys(
  self: ArticleDataSource,
  stageKeys: string[],
): Effect.Effect<ArticleDataSource> {
  const { source } = self
  const stageKeySet = HashSet.fromIterable(stageKeys)
  return pipe(
    Ref.updateAndGet(source, (queries) => {
      return Array.map(queries, (query) => {
        if (HashSet.has(stageKeySet, query.stageKey)) {
          return {
            ...query,
            query: { ...query.query, page: 1 },
          }
        }
        return query
      })
    }),
    Effect.map((queries) => Array.filter(queries, (item) => HashSet.has(stageKeySet, item.stageKey))),
    Effect.flatMap((queries) => getBatchByQueries(self, queries)),
  )
}

export function refreshAll(self: ArticleDataSource): Effect.Effect<ArticleDataSource> {
  const { source, localSource } = self
  return pipe(
    Effect.gen(function* () {
      const searchService = yield* TypesenseSearchService
      const queries: StageQueryResult[] = yield* Ref.get(source)
      const nextQueries: StageQueryResult[] = yield* pipe(
        Effect.sync(() =>
          Array.flatMap(queries, (stageQuery) =>
            Array.makeBy(stageQuery.query.page ?? 0, (page): StageQueryResult => {
              return {
                ...stageQuery,
                query: {
                  ...stageQuery.query,
                  // index start from zero, we need to +1 to convert it to page number
                  page: page + 1,
                },
              }
            }),
          ),
        ),
        Effect.flatMap((queries) =>
          Effect.mergeAll(
            Array.map(queries, (stageQuery) =>
              pipe(
                searchService.search(stageQuery.query),
                withDefaultRetry,
                Effect.map((res) => ({
                  ...stageQuery,
                  hitsPerPage: [res.hits?.map((hit) => hit.document) ?? []],
                  total: res.found,
                })),
              ),
            ),
            HashMap.empty<string, StageQueryResult>(),
            (map, stageQuery: StageQueryResult) => {
              return pipe(
                HashMap.get(map, stageQuery.stageKey),
                Option.map(
                  (previousQuery): StageQueryResult => ({
                    ...previousQuery,
                    query: {
                      ...previousQuery.query,
                      page: max([previousQuery.query.page ?? 1, stageQuery.query.page ?? 1]) ?? 0,
                    },
                    // mergeAll is from right to left
                    hitsPerPage: [...stageQuery.hitsPerPage, ...previousQuery.hitsPerPage],
                  }),
                ),
                Option.getOrElse((): StageQueryResult => stageQuery),
                (query) => {
                  return HashMap.set(map, query.stageKey, query)
                },
              )
            },
            { batching: true, concurrency: 'unbounded' },
          ),
        ),
        Effect.map((map) =>
          Array.map(queries, (query) =>
            pipe(
              HashMap.get(map, query.stageKey),
              Option.getOrElse(() => query),
            ),
          ),
        ),
      )

      yield* Ref.set(source, nextQueries)
      yield* Ref.update(localSource, (local) => LocalDocument.removeOutdated(local, nextQueries))
      return nextQueries
    }),
    withUpdate(self),
    Effect.as(self),
    provideService(self),
  )
}

export function getBatchByQueries(
  self: ArticleDataSource,
  queries: StageQueryResult[],
): Effect.Effect<ArticleDataSource> {
  const { source, typesenseService } = self
  return pipe(
    Effect.gen(function* () {
      const responses = yield* pipe(
        typesenseService.multiSearch({
          searches: queries.map((item) => item.query),
        }),
        withDefaultRetry,
      )

      const updatedQueries = pipe(
        Array.zip(queries, responses.results),
        Array.map(
          ([query, res]) =>
            [
              query.stageKey,
              {
                ...query,
                total: res.found,
                hitsPerPage: [res.hits?.map((hit) => hit.document) ?? []],
              },
            ] as const,
        ),
        HashMap.fromIterable,
      )

      yield* Ref.update(source, (queries) =>
        queries.map(
          (query) =>
            pipe(
              HashMap.get(updatedQueries, query.stageKey),
              Option.getOrElse(() => query),
            ) as WritableDeep<StageQueryResult>,
        ),
      )

      return self
    }),
    withUpdate(self),
  )
}

export function getPage(
  self: ArticleDataSource,
  { stageKey, page }: { stageKey: string; page: number },
): Effect.Effect<ArticleDataSource> {
  const { source, typesenseService } = self
  return pipe(
    Effect.gen(function* () {
      const sourceQueries = yield* Ref.get(source)
      const stageQueryResult = yield* pipe(
        Effect.succeed(Array.findFirst(sourceQueries, (item) => item.stageKey === stageKey)),
        Effect.flatMap((query) =>
          Option.match(query, {
            onSome: (stageQuery) => {
              const currentPage = stageQuery.query.page ?? 0
              // early return as we already load the specific page
              if (currentPage === page) {
                return Effect.succeed(Option.none())
              }

              const normalizedPage = Number.clamp(page, {
                minimum: 1,
                // don't over maximum possible page
                maximum: Math.ceil(stageQuery.total / (stageQuery.query.per_page ?? 10)),
              })

              // we are loading an invalid page
              if (normalizedPage !== page) {
                return Effect.succeed(Option.none())
              }

              const nextStageQuery = {
                ...stageQuery,
                query: {
                  ...stageQuery.query,
                  page: normalizedPage,
                },
              }

              return pipe(
                typesenseService.search<TypesenseArticleDocument>({
                  collection: 'article',
                  query: nextStageQuery.query,
                }),
                withDefaultRetry,
                Effect.map((res): Option.Option<StageQueryResult> => {
                  const pageItem = res.hits?.map((hit) => hit.document) ?? []
                  return Option.some({
                    ...nextStageQuery,
                    hitsPerPage: arrayAppendOrReplace(stageQuery.hitsPerPage, normalizedPage, currentPage, pageItem),
                    // typesense will return total match
                    total: res.found,
                  })
                }),
              )
            },
            onNone: () => Effect.succeed(Option.none()),
          }),
        ),
      )

      if (Option.isNone(stageQueryResult)) {
        return
      }

      yield* Ref.update(source, (queries) => {
        return Array.map(queries, (item) => {
          if (item.stageKey === stageKey) {
            return stageQueryResult.value
          }
          return item
        })
      })
    }),
    Effect.when(() => page > 1),
    withUpdate(self),
    Effect.as(self),
  )
}

export interface SetSortByInput {
  stageKey: string
  sortBy: SortArticleBy
}

export function setSortBy(self: ArticleDataSource, { stageKey, sortBy }: SetSortByInput) {
  const [id, type] = parseStageKey(stageKey)
  const nextSortBy = createSortBy({ id, type: type as 'published' }, sortBy)

  return pipe(
    Ref.update(self.source, (queries) => {
      return Array.map(queries, (query) => {
        if (query.stageKey === stageKey) {
          return {
            ...query,
            query: {
              ...query.query,
              sort_by: nextSortBy,
            },
          }
        }
        return query
      })
    }),
    Effect.flatMap(() => refreshBatchByStageKeys(self, [stageKey])),
  )
}

export function getDocumentByIndex(
  self: ArticleDataSource,
  index: SourceArticleIndex.SourceArticleIndex,
): Effect.Effect<TypesenseArticleDocument> {
  return pipe(
    Ref.get(self.source),
    Effect.map((source) => {
      const stageQuery = source[index[0]]
      const pageItems = stageQuery.hitsPerPage[index[1]]
      return pageItems[index[2]]
    }),
  )
}

export function insertMany(
  self: ArticleDataSource,
  documents: TypesenseArticleDocument[],
  index = ArticleIndex.empty(),
) {
  return pipe(
    Ref.update(self.localSource, (local) => LocalDocument.insertMany(local, { index, documents })),
    withUpdate(self),
    Effect.as(self),
  )
}

export type SearchPredicate = (
  document: TypesenseArticleDocument,
  index: SourceArticleIndex.SourceArticleIndex,
) => boolean

export function searchDocument(
  self: ArticleDataSource,
  cb: SearchPredicate,
  offset = SourceArticleIndex.refine([0, 0, 0]),
): Effect.Effect<Option.Option<DocumentWithIndex>> {
  return Effect.gen(function* () {
    const sourceArticleQueries = yield* Ref.get(self.source)
    return searchInSourceArticleQueries(sourceArticleQueries, cb, offset)
  })
}

export function searchInSourceArticleQueries(
  sourceArticleQueries: StageQueryResult[],
  cb: SearchPredicate,
  offset: SourceArticleIndex.SourceArticleIndex,
) {
  for (let x = offset[0], X = sourceArticleQueries.length; x < X; x++) {
    const stageQuery = sourceArticleQueries[x]
    for (let y = offset[1], Y = stageQuery.hitsPerPage.length; y < Y; y++) {
      const pageItems = stageQuery.hitsPerPage[y]
      for (let z = offset[2], Z = pageItems.length; z < Z; z++) {
        const index = SourceArticleIndex.refine([x, y, z])
        if (cb(pageItems[z], index)) {
          return Option.some({ index, document: pageItems[z] })
        }
      }
    }
  }
  return Option.none()
}

export function setQueries(self: ArticleDataSource, queries: StageQueryResult[]) {
  self.sourceQueryRef.value = queries
  return pipe(Ref.set(self.source, queries), Effect.as(self))
}

export function insertBefore(self: ArticleDataSource, documentWithPivot: LocalDocument.WithPivot) {
  return pipe(
    Ref.updateAndGet(self.localSource, (local) => LocalDocument.insertBefore(local, documentWithPivot)),
    withUpdate(self),
  )
}

export function insert(self: ArticleDataSource, documentWithIndex: LocalDocument.WithIndex) {
  return pipe(
    Ref.updateAndGet(self.localSource, (local) => LocalDocument.insert(local, documentWithIndex)),
    withUpdate(self),
  )
}

function delete_(self: ArticleDataSource, document: TypesenseArticleDocument) {
  return pipe(
    Ref.updateAndGet(self.localSource, (local) => LocalDocument.delete(local, document)),
    withUpdate(self),
  )
}

export { delete_ as delete }

export function update(self: ArticleDataSource, document: TypesenseArticleDocument) {
  return pipe(
    Ref.updateAndGet(self.localSource, (local) => LocalDocument.update(local, document)),
    withUpdate(self),
  )
}

export function clear(self: ArticleDataSource) {
  self.sourceQueryRef.value = []

  return pipe(Effect.all([Ref.set(self.localSource, LocalDocument.empty()), Ref.set(self.source, [])]), Effect.as(self))
}

export function moveArticle(
  self: ArticleDataSource,
  documentWithOrigin: DocumentWithOriginPosition,
): Effect.Effect<() => Effect.Effect<void>> {
  return pipe(
    Effect.gen(function* () {
      const local = yield* Ref.get(self.localSource)
      const index = yield* resolveIndex(self, documentWithOrigin.index)
      const origin = yield* resolveIndex(self, documentWithOrigin.origin)
      const [newLocal, restoreLocal] = LocalDocument.moveWithRestore(local, {
        ...documentWithOrigin,
        pivot: Option.fromNullable(documentWithOrigin.pivot),
        index,
        origin,
      })
      yield* Ref.set(self.localSource, newLocal)
      /**
       * revert change for current function
       *
       * @returns void
       */
      const restore = () => pipe(Ref.update(self.localSource, restoreLocal), withUpdate(self))
      return restore
    }),
    withUpdate(self),
  )
}

export function withLocalRestorable(
  self: ArticleDataSource,
  action: (local: LocalDocument.LocalDocument) => LocalDocument.LocalDocument,
): Effect.Effect<() => Effect.Effect<void>> {
  return pipe(
    Effect.gen(function* () {
      const local = yield* Ref.get(self.localSource)
      const [newLocal, restoreLocal] = LocalDocument.withRestore(local, action)
      yield* Ref.set(self.localSource, newLocal)
      const restore = () => pipe(Ref.update(self.localSource, restoreLocal), withUpdate(self))
      return restore
    }),
    withUpdate(self),
  )
}

export function createArticle(
  self: ArticleDataSource,
  blueprint: TypesenseArticleDocument,
  getRealId: Effect.Effect<string>,
) {
  return pipe(
    Ref.modify(self.localSource, (local) =>
      LocalDocument.createWith(local, { document: blueprint, index: ArticleIndex.empty() }),
    ),
    withUpdate(self),
    Effect.flatMap((localId) =>
      pipe(
        getRealId,
        Effect.map((realId) => [localId, realId] as const),
      ),
    ),
    Effect.flatMap(([localId, realId]) =>
      Ref.update(self.localSource, (local) => LocalDocument.updateId(local, localId, realId)),
    ),
    withUpdate(self),
    Effect.as(self),
  )
}

export function resolveIndex(self: ArticleDataSource, index: SourceArticleIndex.SourceArticleIndex) {
  return pipe(
    Ref.get(self.source),
    Effect.map((queries): ArticleIndex.ArticleIndex => {
      const targetStage = queries[index[0]]
      invariant(targetStage, 'Target stage not found')
      const perPage = targetStage.query.per_page ?? SourceArticleIndex.ITEM_PRE_PAGE

      return ArticleIndex.fromSourceArticleIndex(index, perPage)
    }),
  )
}

function withUpdate(self: ArticleDataSource): <R, E, A>(action: Effect.Effect<R, E, A>) => Effect.Effect<R, E, A> {
  return (action) =>
    pipe(
      Effect.addFinalizer(() => {
        return updateSourceQuery(self)
      }),
      Effect.flatMap(() => action),
      Effect.scoped,
    )
}

function updateSourceQuery(self: ArticleDataSource) {
  const { localSource, sourceQueryRef, source } = self

  return Effect.gen(function* () {
    const local = yield* Ref.get(localSource)
    const sourceQueries = yield* Ref.get(source)
    // If user is dragging, we will discard current update as it will cause user's dragging card change
    if (!self.isDragging) {
      sourceQueryRef.value = LocalDocument.combineWithSource(local, sourceQueries)
    }
    return self
  })
}

function provideService(self: ArticleDataSource) {
  return <R, E, A>(effect: Effect.Effect<R, E, A>) => {
    return pipe(
      effect,
      Effect.provide(provideTypesenseSearchService()),
      Effect.provideService(TypesenseService, self.typesenseService),
    )
  }
}
