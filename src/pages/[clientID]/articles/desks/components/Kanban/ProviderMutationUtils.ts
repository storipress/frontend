import type { ComputedRef, Ref as VRef } from 'vue'
import { Array, Effect, Function, Option, pipe } from 'effect'
import { captureException } from '@sentry/vue'
import type { StageQueryResult, StageWithType, TypesenseArticleDocument } from './definition'
import type { LocalDocument } from './ArticleDataSource'
import { ArticleDataSource, ArticleIndex, SourceArticleIndex } from './ArticleDataSource'
import type { DocumentWithIndex, DocumentWithPivot, SearchPredicate } from './ArticleDataSource/ArticleDataSource'
import type { SortArticleBy } from './search-query-provider'
import type { GetMeQuery } from '~/graphql-operations'
import { useEffectRuntime } from '~/effects'

export type SourceArticleQueriesIndex = [stage: number, page: number, index: number]

export class ProviderMutationUtils {
  stagesWithType: ComputedRef<StageWithType[]>
  me: ComputedRef<GetMeQuery['me'] | undefined>
  mapArticleIdToSyncProcess = new Map<string, Promise<unknown>>()
  articleDataSource: VRef<ArticleDataSource.ArticleDataSource>

  constructor(
    stagesWithType: ComputedRef<StageWithType[]>,
    me: ComputedRef<GetMeQuery['me'] | undefined>,
    articleDataSource: VRef<ArticleDataSource.ArticleDataSource>,
  ) {
    this.stagesWithType = stagesWithType
    this.me = me
    this.articleDataSource = articleDataSource
  }

  get isReady() {
    return this.stagesWithType.value && this.articleDataSource.value && this.me.value?.id
  }

  /**
   * load data from Typesense
   * @param stageKeys
   */
  async refreshByStageKeys(stageKeys: string[]) {
    if (stageKeys.length === 0) {
      return
    }

    if (!this.isReady) {
      return
    }

    const runtime = useEffectRuntime()
    await runtime.runPromise(ArticleDataSource.refreshBatchByStageKeys(this.articleDataSource.value, stageKeys))
  }

  async refreshByStageKey(key: string) {
    await this.refreshByStageKeys([key])
  }

  /**
   * Set loaded page to specific page and load it
   * @param stageQueryResult
   * @param page
   */
  async loadPage(stageQueryResult: StageQueryResult, page: number) {
    if (!this.isReady) {
      return
    }

    await Effect.runPromise(
      ArticleDataSource.getPage(this.articleDataSource.value, {
        page,
        stageKey: stageQueryResult.stageKey,
      }),
    )
  }

  async setSortBy(stageKey: string, sortBy: SortArticleBy) {
    if (!this.isReady) {
      return
    }

    const runtime = useEffectRuntime()
    await runtime.runPromise(
      ArticleDataSource.setSortBy(this.articleDataSource.value, {
        sortBy,
        stageKey,
      }),
    )
  }

  searchInSourceArticleQueries(
    cb: SearchPredicate,
    offset = SourceArticleIndex.refine([0, 0, 0]),
  ): DocumentWithIndex | undefined {
    return pipe(
      Effect.runSync(ArticleDataSource.searchDocument(this.articleDataSource.value, cb, offset)),
      Option.getOrUndefined,
    )
  }

  searchByIdInSourceArticleQueries(
    id: string,
    offset = SourceArticleIndex.refine([0, 0, 0]),
  ): DocumentWithIndex | undefined {
    return this.searchInSourceArticleQueries((item) => item.id === id, offset)
  }

  removeDocumentInSourceArticleQueries([stage, page, index]: SourceArticleQueriesIndex) {
    if (!this.isReady) {
      return
    }

    const document = this.articleDataSource.value.sourceQueryRef.value?.[stage].hitsPerPage?.[page]?.[index]

    if (!document) {
      const articleDataSourceIdList = this.articleDataSource.value.sourceQueryRef.value.map((stage) => {
        return stage.hitsPerPage?.map((page) => {
          return page?.map(({ id }) => id)
        })
      })
      captureException(
        new Error('fail: can not find the document when removing document in SourceArticle'),
        (scope) => {
          scope.setContext('sourceArticleQueries', {
            sourceArticleQueriesIndex: [stage, page, index],
            articleDataSourceIdList: JSON.stringify(articleDataSourceIdList),
          })
          return scope
        },
      )
      const runtime = useEffectRuntime()
      runtime.runPromise(ArticleDataSource.refreshAll(this.articleDataSource.value))
      return
    }
    Effect.runSync(ArticleDataSource.delete(this.articleDataSource.value, document))
  }

  insertDocumentBefore({ document, index, pivot }: DocumentWithPivot) {
    if (!this.isReady) {
      return
    }

    Effect.runSync(
      pipe(
        ArticleDataSource.resolveIndex(this.articleDataSource.value, index),
        Effect.flatMap((index) =>
          ArticleDataSource.insertBefore(this.articleDataSource.value, { document, index, pivot }),
        ),
      ),
    )
  }

  insertDocumentInSourceArticleQueries({ document, index }: DocumentWithIndex) {
    if (!this.isReady) {
      return
    }

    const articleIndex = Effect.runSync(ArticleDataSource.resolveIndex(this.articleDataSource.value, index))
    Effect.runSync(ArticleDataSource.insert(this.articleDataSource.value, { document, index: articleIndex }))
  }

  async duplicateDocument(document: TypesenseArticleDocument, getRealId: Effect.Effect<string>) {
    if (!this.isReady) {
      return
    }

    const runtime = useEffectRuntime()
    await runtime.runPromise(ArticleDataSource.createArticle(this.articleDataSource.value, document, getRealId))
  }

  getDocumentInSourceArticleQueries(index: SourceArticleQueriesIndex): TypesenseArticleDocument | undefined {
    return this.articleDataSource.value?.sourceQueryRef.value[index[0]]?.hitsPerPage?.[index[1]]?.[index[2]]
  }

  registerArticleNextOperation(id: string, callback: () => Promise<unknown>) {
    let promise = this.mapArticleIdToSyncProcess.get(id) ?? Promise.resolve()
    promise = promise.then(callback)
    this.mapArticleIdToSyncProcess.set(id, promise)
    return promise
  }

  /**
   * helper for batch move articles from a stage to another stage
   * when remove stage, we need to move existing article to left stage
   */
  moveAllArticleToStage(sourceStageKey: string, destStageKey: string) {
    const sourceStage = this.articleDataSource.value.sourceQueryRef.value.find(
      (stage) => stage.stageKey === sourceStageKey,
    )
    const destStageIndex = this.articleDataSource.value.sourceQueryRef.value.findIndex(
      (stage) => stage.stageKey === destStageKey,
    )

    if (!sourceStage || destStageIndex == null) {
      return
    }

    Effect.runSync(
      ArticleDataSource.insertMany(
        this.articleDataSource.value,
        Array.flatten(sourceStage.hitsPerPage),
        ArticleIndex.refine([destStageIndex, 0]),
      ),
    )
  }

  async withRestorable(
    action: (
      modify: (commit: (local: LocalDocument.LocalDocument) => LocalDocument.LocalDocument) => void,
      restore: () => void,
    ) => Promise<void>,
  ) {
    let _restore: () => void = Function.constVoid
    await action(
      (commit) => {
        const restoreEffect = Effect.runSync(
          ArticleDataSource.withLocalRestorable(this.articleDataSource.value, commit),
        )
        _restore = () => Effect.runSync(restoreEffect())
      },
      () => {
        _restore()
      },
    )
  }

  resolveIndex(index: SourceArticleIndex.SourceArticleIndex) {
    return Effect.runSync(ArticleDataSource.resolveIndex(this.articleDataSource.value, index))
  }

  async moveArticleWithPivot(
    id: string,
    newPosition: SourceArticleIndex.SourceArticleIndex,
    pivot: string | undefined,
    changeForNewPosition: (doc: TypesenseArticleDocument) => TypesenseArticleDocument,
    afterMove: (data: { from: DocumentWithIndex; to: DocumentWithIndex }) => Promise<number>,
  ) {
    const from = this.searchByIdInSourceArticleQueries(id)
    if (!from) {
      return
    }
    const to = {
      index: newPosition,
      document: changeForNewPosition(from.document),
    }
    Effect.runSync(
      ArticleDataSource.moveArticle(this.articleDataSource.value, {
        document: to.document,
        pivot,
        index: to.index,
        origin: from.index,
      }),
    )

    await this.registerArticleNextOperation(id, async () => {
      await afterMove({ from, to })
    })
  }

  async moveArticleAndConfirmUndo(
    id: string,
    newPosition: SourceArticleIndex.SourceArticleIndex,
    changeForNewPosition: (doc: TypesenseArticleDocument) => TypesenseArticleDocument,
    afterMove: (data: { from: DocumentWithIndex; to: DocumentWithIndex }) => Promise<number>,
    confirmUndo: (id: string) => Promise<boolean>,
    afterUndo: (data: { from: DocumentWithIndex; to: DocumentWithIndex }) => Promise<unknown>,
  ) {
    const from = this.searchByIdInSourceArticleQueries(id)
    if (!from) {
      return
    }
    const to = {
      index: newPosition,
      document: changeForNewPosition(from.document),
    }
    const restore = Effect.runSync(
      ArticleDataSource.moveArticle(this.articleDataSource.value, {
        document: to.document,
        index: to.index,
        origin: from.index,
      }),
    )

    const promiseForLaterAwait = this.registerArticleNextOperation(id, async () => {
      await afterMove({ from, to })
    })

    if (await confirmUndo(id)) {
      await promiseForLaterAwait
      this.registerArticleNextOperation(id, async () => {
        Effect.runSync(restore())
        const to = this.searchByIdInSourceArticleQueries(id, newPosition)
        if (to) {
          await afterUndo({ from, to })
        }
      }).catch((e) => {
        throw new Error(e)
      })
    } else {
      await promiseForLaterAwait
    }
  }

  async refreshByStageKeyAndCheckSortRule(stageKey: string, checker: (list: TypesenseArticleDocument[]) => boolean) {
    const stageIndex = this.articleDataSource.value.sourceQueryRef.value.findIndex(
      (query) => query.stageKey === stageKey,
    )
    if (stageIndex !== -1) {
      for (let i = 0; i < 20; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        await this.refreshByStageKey(stageKey)
        const list = this.articleDataSource.value.sourceQueryRef.value[stageIndex]?.hitsPerPage.flat() ?? []
        if (list.length === 0 || checker(list)) break
      }
    }
  }

  updateDocument(document: TypesenseArticleDocument) {
    if (!this.isReady) {
      return
    }

    Effect.runSync(ArticleDataSource.update(this.articleDataSource.value, document))
  }
}

export default ProviderMutationUtils
