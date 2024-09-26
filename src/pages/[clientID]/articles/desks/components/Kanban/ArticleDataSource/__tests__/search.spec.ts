import { describe, expect, it } from 'vitest'
import { Option } from 'effect'
import type { StageQueryResult } from '../../definition'
import { searchInSourceArticleQueries } from '../ArticleDataSource'
import { emptyArticle } from '../../_test-helpers'
import { empty } from '../SourceArticleIndex'

const mockArticles: StageQueryResult[] = [
  {
    query: {
      q: '',
      query_by: 'title',
      page: 1,
    },
    stageKey: '1-default',
    total: 2,
    hitsPerPage: [
      [
        {
          ...emptyArticle,
          id: '1',
        },
        {
          ...emptyArticle,
          id: '2',
        },
      ],
    ],
  },
  {
    query: {
      q: '',
      query_by: 'title',
      page: 1,
    },
    stageKey: '2-default',
    total: 2,
    hitsPerPage: [
      [
        {
          ...emptyArticle,
          id: '3',
        },
        {
          ...emptyArticle,
          id: '4',
        },
      ],
    ],
  },
  {
    query: {
      q: '',
      query_by: 'title',
      page: 2,
    },
    stageKey: '3-default',
    total: 4,
    hitsPerPage: [
      [
        {
          ...emptyArticle,
          id: '5',
        },
        {
          ...emptyArticle,
          id: '6',
        },
      ],
      [
        {
          ...emptyArticle,
          id: '7',
        },
        {
          ...emptyArticle,
          id: '8',
        },
      ],
    ],
  },
]

describe('searchInSourceArticleQueries', () => {
  it('should return search result', () => {
    expect(Option.getOrUndefined(searchInSourceArticleQueries(mockArticles, (doc) => doc.id === '1', empty()))).toEqual(
      {
        document: mockArticles[0].hitsPerPage[0][0],
        index: [0, 0, 0],
      },
    )
    expect(Option.getOrUndefined(searchInSourceArticleQueries(mockArticles, (doc) => doc.id === '2', empty()))).toEqual(
      {
        document: mockArticles[0].hitsPerPage[0][1],
        index: [0, 0, 1],
      },
    )

    expect(Option.getOrUndefined(searchInSourceArticleQueries(mockArticles, (doc) => doc.id === '3', empty()))).toEqual(
      {
        document: mockArticles[1].hitsPerPage[0][0],
        index: [1, 0, 0],
      },
    )

    expect(Option.getOrUndefined(searchInSourceArticleQueries(mockArticles, (doc) => doc.id === '7', empty()))).toEqual(
      {
        document: mockArticles[2].hitsPerPage[1][0],
        index: [2, 1, 0],
      },
    )
  })
})
