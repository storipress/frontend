import { describe, it } from 'vitest'
import { setActivePinia } from 'pinia'
import { buildFilterQuery, useQueryProvider } from '../search-query-provider'
import { setupTestPinia } from '~/test-helpers'
import { useSearchConditionStore } from '~/stores/search-condition'

beforeEach(() => {
  setActivePinia(setupTestPinia())
})

describe('useQueryProvider', () => {
  it('create search condition', () => {
    const { constructQuery } = useQueryProvider()

    expect(
      constructQuery(
        {
          id: '1',
        },
        {
          id: '1',
          type: 'default',
        },
      ),
    ).toMatchInlineSnapshot(`
      {
        "collection": "articles",
        "filter_by": "stage_id:=1 && published:=false && desk_id:[1]",
        "highlight_full_fields": "title",
        "include_fields": "desk_id,desk_name,stage_id,stage_name,title,slug,blurb,featured,cover,order,author_ids,author_names,author_avatars,tag_ids,tag_names,published,published_at,created_at,updated_at,id",
        "page": 1,
        "per_page": 10,
        "q": "*",
        "query_by": "title,content",
        "sort_by": "title:asc",
      }
    `)

    expect(
      constructQuery(
        {
          id: '1',
        },
        {
          id: '1',
          type: 'published',
        },
      ),
    ).toMatchInlineSnapshot(`
      {
        "collection": "articles",
        "filter_by": "stage_id:=1 && published:=true && desk_id:[1]",
        "highlight_full_fields": "title",
        "include_fields": "desk_id,desk_name,stage_id,stage_name,title,slug,blurb,featured,cover,order,author_ids,author_names,author_avatars,tag_ids,tag_names,published,published_at,created_at,updated_at,id",
        "page": 1,
        "per_page": 11,
        "q": "*",
        "query_by": "title,content",
        "sort_by": "published_at:desc,title:asc",
      }
    `)

    expect(
      constructQuery(
        {
          id: '1',
        },
        {
          id: '1',
          type: 'ready',
        },
      ),
    ).toMatchInlineSnapshot(`
      {
        "collection": "articles",
        "filter_by": "stage_id:=1 && published:=false && desk_id:[1]",
        "highlight_full_fields": "title",
        "include_fields": "desk_id,desk_name,stage_id,stage_name,title,slug,blurb,featured,cover,order,author_ids,author_names,author_avatars,tag_ids,tag_names,published,published_at,created_at,updated_at,id",
        "page": 1,
        "per_page": 10,
        "q": "*",
        "query_by": "title,content",
        "sort_by": "title:asc",
      }
    `)

    const searchConditionStore = useSearchConditionStore()
    searchConditionStore.text = 'test'
    searchConditionStore.people = [{ id: '1', desks: [] }]
    searchConditionStore.range = [new Date('2023-12-10T00:00:00Z'), new Date('2023-12-10T16:00:00Z')]

    expect(
      constructQuery(
        {
          id: '1',
        },
        {
          id: '1',
          type: 'default',
        },
      ),
    ).toMatchInlineSnapshot(`
      {
        "collection": "articles",
        "filter_by": "stage_id:=1 && published:=false && desk_id:[1] && author_ids:[1] && created_at:[1702166400..1702224000]",
        "highlight_full_fields": "title",
        "include_fields": "desk_id,desk_name,stage_id,stage_name,title,slug,blurb,featured,cover,order,author_ids,author_names,author_avatars,tag_ids,tag_names,published,published_at,created_at,updated_at,id",
        "page": 1,
        "per_page": 10,
        "q": "test",
        "query_by": "title,content",
        "sort_by": "title:asc",
      }
    `)
  })
})

describe('buildFilterQuery', () => {
  it('should create filter query', () => {
    expect(
      buildFilterQuery({
        string: 'test',
        empty: [],
        boolean: true,
        list: ['1', '2'],
        range: [new Date('2023-12-10T00:00:00Z'), new Date('2023-12-10T16:00:00Z')],
      }),
    ).toMatchInlineSnapshot(`"string:=test && boolean:=true && list:[1,2] && range:[1702166400..1702224000]"`)
  })
})
