import { Effect, pipe } from 'effect'
import type { MultiSearchResponse } from 'typesense/lib/Typesense/MultiSearch'
import { ProviderMutationUtils } from '../ProviderMutationUtils'
import { ProviderMutationArticleClass } from '../ProviderMutationArticleClass'
import { ArticleDataSource } from '../ArticleDataSource'
import type { StageWithType } from '../definition'
import { TypesenseService } from '~/effects/services/TypesenseService'

const mutateMoveArticleToDesk = vi.fn()

vi.mock('../card-apis', () => ({
  useCardRelatedAPI: () => ({ mutateMoveArticleToDesk }),
}))

vi.mock('~/composables/desks', () => ({
  useDesks: () => ({
    desks: computed(() => [
      { id: '1', desks: [] },
      { id: '2', desks: [{ id: '3' }] },
    ]),
  }),
}))

let mutation: ProviderMutationArticleClass

beforeEach(async () => {
  mutateMoveArticleToDesk.mockClear()

  const mockStageWithType = computed(() => [
    {
      id: '1',
      name: 'test',
      key: '1',
      type: 'default',
    } as unknown as StageWithType,
  ])

  const articleSource = Effect.runSync(
    pipe(
      ArticleDataSource.make(),
      Effect.provideService(
        TypesenseService,
        TypesenseService.of({
          multiSearch: (): Effect.Effect<MultiSearchResponse<any>> =>
            Effect.succeed({
              results: [
                {
                  found: 1,
                  out_of: 1,
                  page: 1,
                  request_params: {},
                  search_time_ms: 0,
                  hits: [
                    {
                      text_match: 1,
                      highlight: {},
                      document: {
                        id: '1',
                      },
                    },
                  ],
                },
              ],
            }),
          search: () => {
            throw new Error('Method not implemented')
          },
        }),
      ),
    ),
  )
  const mutationUtils = new ProviderMutationUtils(
    mockStageWithType,
    computed(
      () =>
        ({
          id: '1',
        }) as any,
    ),
    shallowRef(articleSource),
  )

  mutation = new ProviderMutationArticleClass(
    mutationUtils,
    computed(() => ({}) as any),
    mockStageWithType,
    undefined,
    articleSource.sourceQueryRef,
    computed(() => new Map()),
    computed(
      () =>
        ({
          desks: [],
        }) as any,
    ),
  )

  // simulate fill in articles
  await Effect.runPromise(
    pipe(
      ArticleDataSource.setQueries(articleSource, [
        {
          stageKey: '1',
          hitsPerPage: [],
          query: { q: '', query_by: 'title' },
          total: 0,
        },
      ]),
      Effect.flatMap((source) => ArticleDataSource.refreshBatchByStageKeys(source, ['1'])),
    ),
  )
})

it('can change desk', async () => {
  // act and assert
  await expect(mutation.moveArticleToDifferentDesk('1', '1')).resolves.toBeUndefined()
  expect(mutateMoveArticleToDesk).toBeCalledWith({ id: '1', desk_id: '1' })
})

it('will not change desk to desk with subdesk', async () => {
  // act and assert
  await expect(mutation.moveArticleToDifferentDesk('1', '2')).resolves.toBeUndefined()
  expect(mutateMoveArticleToDesk).not.toBeCalled()
})

it('can change desk to subdesk', async () => {
  // act and assert
  await expect(mutation.moveArticleToDifferentDesk('1', '3')).resolves.toBeUndefined()
  expect(mutateMoveArticleToDesk).toBeCalledWith({ id: '1', desk_id: '3' })
})
