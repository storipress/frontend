import { describe, expect, it } from 'vitest'
import { Effect, pipe } from 'effect'
import type { SearchResponse } from 'typesense/lib/Typesense/Documents'
import * as ArticleDataSource from '../ArticleDataSource'
import type { TypesenseArticleDocument } from '../../definition'
import { emptyArticle } from '../../_test-helpers'
import { SortArticleBy } from '../../search-query-provider'
import { TypesenseService } from '~/effects/services/TypesenseService'

describe('setQueries', () => {
  it('should initialize article source', async () => {
    const multiSearch = vi.fn(() => Effect.succeed({ results: {} as any }))
    const search = vi.fn(
      (): Effect.Effect<SearchResponse<TypesenseArticleDocument>> =>
        Effect.succeed({
          found: 1,
          out_of: 1,
          page: 1,
          request_params: {},
          search_time_ms: 0,
          hits: [
            {
              highlight: {},
              text_match: 0,
              document: {
                ...emptyArticle,
                id: '1',
              },
            },
          ],
        }),
    )
    let articleSource = Effect.runSync(
      pipe(
        ArticleDataSource.make(),
        Effect.flatMap((source) =>
          ArticleDataSource.setQueries(source, [
            {
              stageKey: '1-default',
              query: { collection: 'articles', page: 1, per_page: 10 } as any,
              hitsPerPage: [],
              total: 10,
            },
          ]),
        ),

        Effect.provideService(
          TypesenseService,
          TypesenseService.of({
            multiSearch,
            search: search as any,
          }),
        ),
      ),
    )

    articleSource = await Effect.runPromise(
      ArticleDataSource.getPage(articleSource, { page: 2, stageKey: '1-default' }),
    )

    expect(articleSource).toMatchInlineSnapshot(`
      ArticleDataSource {
        "isDragging": false,
        "localSource": RefImpl {
          "get": {
            "_id": "Effect",
            "_op": "Sync",
            "effect_instruction_i0": [Function],
            "effect_instruction_i1": undefined,
            "effect_instruction_i2": undefined,
          },
          "ref": {
            "_id": "MutableRef",
            "current": {
              "deleted": {
                "_id": "HashMap",
                "values": [],
              },
              "inserted": {
                "byId": {
                  "_id": "HashMap",
                  "values": [],
                },
                "byStage": {
                  "_id": "HashMap",
                  "values": [],
                },
              },
              "modified": {
                "_id": "HashMap",
                "values": [],
              },
            },
          },
          Symbol(effect/Ref): {
            "_A": [Function],
          },
          Symbol(effect/Readable): Symbol(effect/Readable),
        },
        "source": RefImpl {
          "get": {
            "_id": "Effect",
            "_op": "Sync",
            "effect_instruction_i0": [Function],
            "effect_instruction_i1": undefined,
            "effect_instruction_i2": undefined,
          },
          "ref": {
            "_id": "MutableRef",
            "current": [
              {
                "hitsPerPage": [],
                "query": {
                  "collection": "articles",
                  "page": 1,
                  "per_page": 10,
                },
                "stageKey": "1-default",
                "total": 10,
              },
            ],
          },
          Symbol(effect/Ref): {
            "_A": [Function],
          },
          Symbol(effect/Readable): Symbol(effect/Readable),
        },
        "sourceQueryRef": CustomRefImpl {
          "__v_isRef": true,
          "_get": [Function],
          "_set": [Function],
          "_value": undefined,
          "dep": Dep {
            "activeLink": undefined,
            "computed": undefined,
            "key": undefined,
            "map": undefined,
            "subs": undefined,
            "subsHead": undefined,
            "target": undefined,
            "version": 3,
          },
          "get": [Function],
          "lay": [Function],
          "peek": [Function],
          "set": [Function],
          "silentSet": [Function],
          "untrackedGet": [Function],
        },
        "typesenseService": {
          "multiSearch": [MockFunction spy],
          "search": [MockFunction spy],
        },
      }
    `)
  })
})

describe('refreshBatchByStageKeys', () => {
  it('should refresh article source', async () => {
    const multiSearch = vi.fn(() =>
      Effect.succeed({
        results: {
          0: {
            found: 1,
            out_of: 1,
            page: 1,
            request_params: {},
            search_time_ms: 0,
            hits: [
              {
                highlight: {},
                text_match: 0,
                document: {
                  ...emptyArticle,
                  id: '1',
                },
              },
            ],
          },
          length: 1,
        },
      }),
    )
    const search = vi.fn()
    let articleSource = Effect.runSync(
      pipe(
        ArticleDataSource.make(),
        Effect.flatMap((source) =>
          ArticleDataSource.setQueries(source, [
            {
              stageKey: '1-default',
              query: { collection: 'articles', page: 1, per_page: 10 } as any,
              hitsPerPage: [],
              total: 10,
            },
          ]),
        ),

        Effect.provideService(
          TypesenseService,
          TypesenseService.of({
            multiSearch: multiSearch as any,
            search: search as any,
          }),
        ),
      ),
    )

    articleSource = await Effect.runPromise(ArticleDataSource.refreshBatchByStageKeys(articleSource, ['1-default']))

    expect(multiSearch).toBeCalledWith({
      searches: [
        {
          collection: 'articles',
          per_page: 10,
          page: 1,
        },
      ],
    })

    expect(articleSource.sourceQueryRef.value).toMatchInlineSnapshot(`
      [
        {
          "hitsPerPage": [
            [
              {
                "author_avatars": [],
                "author_ids": [],
                "author_names": [],
                "blurb": "",
                "cover": "",
                "created_at": 0,
                "desk_id": 0,
                "desk_name": "desk",
                "featured": false,
                "id": "1",
                "order": 0,
                "published": false,
                "published_at": 0,
                "slug": "slug",
                "stage_id": 0,
                "stage_name": "stage",
                "tag_ids": [],
                "tag_names": [],
                "title": "title",
                "updated_at": 0,
              },
            ],
          ],
          "query": {
            "collection": "articles",
            "page": 1,
            "per_page": 10,
          },
          "stageKey": "1-default",
          "total": 1,
        },
      ]
    `)
  })
})

describe('setSortBy', () => {
  it('can set sort by', () => {
    const multiSearch = vi.fn(() =>
      Effect.succeed({
        results: {
          0: {
            found: 1,
            out_of: 1,
            page: 1,
            request_params: {},
            search_time_ms: 0,
            hits: [
              {
                highlight: {},
                text_match: 0,
                document: {
                  ...emptyArticle,
                  id: '1',
                },
              },
            ],
          },
          length: 1,
        },
      }),
    )
    const search = vi.fn()
    const articleSource = Effect.runSync(
      pipe(
        ArticleDataSource.make(),
        Effect.flatMap((source) =>
          ArticleDataSource.setQueries(source, [
            {
              stageKey: '1-default',
              query: { collection: 'articles', page: 1, per_page: 10 } as any,
              hitsPerPage: [],
              total: 10,
            },
          ]),
        ),

        Effect.provideService(
          TypesenseService,
          TypesenseService.of({
            multiSearch: multiSearch as any,
            search: search as any,
          }),
        ),
      ),
    )

    Effect.runSync(
      ArticleDataSource.setSortBy(articleSource, {
        stageKey: '1-default',
        sortBy: SortArticleBy.TitleAsc,
      }),
    )

    expect(articleSource.sourceQueryRef.value[0].query).toMatchInlineSnapshot(`
      {
        "collection": "articles",
        "page": 1,
        "per_page": 10,
        "sort_by": "title:asc",
      }
    `)
  })
})
