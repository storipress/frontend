import { rest } from 'msw'
import typesenseSearchData from './typesense-search.json'
import typesenseUpdateSortData from './typesense-update-sort.json'
import typesenseUpdateStageData from './typesense-update-stage.json'

export const handlers = [
  rest.post('https://search.stori.press/multi_search', (req, res, ctx) => {
    return res(
      ctx.json({
        results: typesenseSearchData.results.slice(0, req.body.searches.length),
      }),
    )
  }),
  rest.get('https://search.stori.press/collections/article/documents/search', (req, res, ctx) => {
    if (req.url.search === '?q=*&query_by=title&per_page=2&pinned_hits=158:1,157:2') {
      return res(ctx.json(typesenseUpdateSortData))
    } else if (req.url.search === '?q=*&query_by=title&per_page=1&pinned_hits=158:1') {
      return res(ctx.json(typesenseUpdateStageData))
    }
  }),
]
