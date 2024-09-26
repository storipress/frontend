import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { ProvideContentInterface } from '@storipress/core-component'
import { Effect, Option } from 'effect'
import { DEFAULT_ITEM as DEFAULT_DESK } from '../LeftHandNavPanel'
import type { StageArticles, StageQueryResult, StageWithType, StagesForView } from './definition'
import type ProviderMutationUtils from './ProviderMutationUtils'
import type { CardAPI } from './card-apis'
import { useCardRelatedAPI } from './card-apis'
import type { ArticleDataSource } from './ArticleDataSource'
import { LocalDocument, SourceArticleIndex, getStageKey, parseStageKey } from './ArticleDataSource'
import { searchInSourceArticleQueries } from './ArticleDataSource/ArticleDataSource'
import type { ListDesksQuery } from '~/graphql-operations'
import { useDesks } from '~/composables'

interface DeskLike {
  id: string
  name: string
  desks: Omit<DeskLike, 'desks'>[]
}

interface UseMoveToDeskInput {
  apis: CardAPI
  currentDesk: MaybeRefOrGetter<DeskLike>
  utils: ProviderMutationUtils
  sourceArticleQueries: Ref<StageQueryResult[]>
}

type MoveToDesk = (id: string, deskId: string) => Promise<void>

interface UseMoveToDeskReturn {
  isPresetDesk: Ref<boolean>
  moveToDesk: MoveToDesk
}

export class ProviderMutationArticleClass {
  #utils: ProviderMutationUtils
  #stagesForView: ComputedRef<StagesForView>
  #stagesWithType: ComputedRef<StageWithType[]>
  #notification: ProvideContentInterface | undefined
  #apis: CardAPI
  #sourceArticleQueries: Ref<StageQueryResult[]>
  #mapStageKeyToArticlesForView: ComputedRef<Map<string, StageArticles>>
  #moveToDesk: MoveToDesk
  #desk: ComputedRef<ListDesksQuery['desks'][0]>
  constructor(
    utils: ProviderMutationUtils,
    stagesForView: ComputedRef<StagesForView>,
    stagesWithType: ComputedRef<StageWithType[]>,
    notification: ProvideContentInterface | undefined,
    sourceArticleQueries: Ref<StageQueryResult[]>,
    mapStageKeyToArticlesForView: ComputedRef<Map<string, StageArticles>>,
    desk: ComputedRef<ListDesksQuery['desks'][0]>,
  ) {
    const apis = useCardRelatedAPI()
    const { moveToDesk } = useMoveToDesk({ apis, currentDesk: desk, utils, sourceArticleQueries })
    this.#utils = utils
    this.#stagesForView = stagesForView
    this.#stagesWithType = stagesWithType
    this.#notification = notification
    this.#apis = apis
    this.#sourceArticleQueries = sourceArticleQueries
    this.#mapStageKeyToArticlesForView = mapStageKeyToArticlesForView
    this.#desk = desk
    this.#moveToDesk = moveToDesk
  }

  async publishArticle(id: string) {
    const publishedAt = new Date()
    const readyStage = this.#stagesForView.value.ready
    await this.#utils.moveArticleAndConfirmUndo(
      id,
      SourceArticleIndex.refine([this.#stagesWithType.value.length - 1, 0, 0]),
      (doc) => ({
        ...doc,
        stage_id: Number(readyStage.id),
        stage_name: readyStage.name,
        published: true,
        published_at: toUnixTimestamp(publishedAt),
      }),
      async () => {
        const temp = await this.#apis.mutatePublishArticle({ id, time: publishedAt.toISOString(), now: true })
        return toUnixTimestamp(new Date(temp?.data?.publishArticle.updated_at))
      },
      (key) => this.#notification?.notifyForPublishNowAndConfirmUndo({ key }) ?? Promise.resolve(false),
      ({ from: { document } }) =>
        Promise.all([
          this.#apis.mutateUnpublishArticle({ id }),
          readyStage.id !== `${document.stage_id}` &&
            this.#apis.mutateChangeArticleStage({ input: { id, stage_id: `${document.stage_id}` } }),
          document.published_at &&
            this.#apis.mutatePublishArticle({ id, time: new Date(document.published_at * 1000).toISOString() }),
        ]),
    )
  }

  async unpublishArticle(id: string) {
    const newPosition: [number, number, number] = [this.#stagesWithType.value.length - 2, 0, 0]
    const beforeDocument = this.#utils.getDocumentInSourceArticleQueries(newPosition)
    await this.#utils.moveArticleAndConfirmUndo(
      id,
      SourceArticleIndex.refine([this.#stagesWithType.value.length - 2, 0, 0]),
      (doc) => ({
        ...doc,
        published: false,
        published_at: undefined,
      }),
      async () => {
        const [temp] = await Promise.all([
          this.#apis.mutateUnpublishArticle({ id }),
          beforeDocument !== undefined &&
            this.#apis.mutateMoveArticleBefore({ input: { id, target_id: beforeDocument.id } }),
        ])
        return toUnixTimestamp(new Date(temp?.data?.unpublishArticle.updated_at))
      },
      (key) => this.#notification?.notifyForUnpublishAndConfirmUndo({ key }) ?? Promise.resolve(false),
      ({ from: { document } }) =>
        this.#apis.mutatePublishArticle({ id, time: new Date((document.published_at ?? 0) * 1000).toISOString() }),
    )
  }

  async unscheduleArticle(id: string) {
    const record = this.#utils.searchByIdInSourceArticleQueries(id)
    if (record?.document.published_at) {
      const { published_at } = record.document
      this.#utils.registerArticleNextOperation(id, async () => {
        record.document.published_at = undefined
        await this.#apis.mutateUnpublishArticle({ id })
      })
      if (await this.#notification?.notifyForUnpublishAndConfirmUndo({ key: id })) {
        await this.#utils.registerArticleNextOperation(id, async () => {
          record.document.published_at = published_at
          await this.#apis.mutatePublishArticle({ id, time: new Date(published_at * 1000).toISOString() })
        })
      }
    }
  }

  async changeFeatureArticle(id: string, value: boolean) {
    const record = this.#utils.searchByIdInSourceArticleQueries(id)
    if (record) {
      const haveToRemoveArticle = this.#desk.value.id === DEFAULT_DESK.FEATURED.id && !value
      await this.#utils.registerArticleNextOperation(id, async () => {
        this.#utils.updateDocument({
          ...record.document,
          featured: value,
        })
        if (haveToRemoveArticle) this.#utils.removeDocumentInSourceArticleQueries(record.index)
        await this.#apis.mutateUpdateArticle({ id, featured: value })
      })
    }
  }

  async deleteArticle(id: string) {
    const record = this.#utils.searchByIdInSourceArticleQueries(id)
    if (!record) {
      return
    }

    await this.#utils.withRestorable(async (modify, restore) => {
      modify((local) => LocalDocument.delete(local, record.document))
      this.#utils.registerArticleNextOperation(id, async () => {
        await this.#apis.mutateDeleteArticle({ id })
      })
      if (await this.#notification?.notifyForDeleteAndConfirmUndo({ key: id })) {
        await this.#utils.registerArticleNextOperation(id, async () => {
          restore()
          await this.#apis.mutateRestoreArticle({ id })
        })
      }
    })
  }

  async duplicateArticle(id: string) {
    const record = this.#utils.searchByIdInSourceArticleQueries(id)
    if (record) {
      await this.#utils.duplicateDocument(
        record.document,
        Effect.promise(async () => {
          const res = await this.#apis.mutateDuplicateArticle({ id })
          return res?.data?.duplicateArticle.id as string
        }),
      )
    }
  }

  async moveArticleBefore(id: string, referenceId: string) {
    const { document } = this.#utils.searchByIdInSourceArticleQueries(id) ?? {}
    const { index: newIndex } = this.#utils.searchByIdInSourceArticleQueries(referenceId) ?? {}
    if (document && newIndex) {
      this.#utils.insertDocumentBefore({
        index: newIndex,
        pivot: referenceId,
        document,
      })

      await this.#apis.mutateMoveArticleBefore({ input: { id, target_id: referenceId } })
    }
  }

  async moveArticleAfter(id: string, referenceId: string) {
    const { document, index: oldIndex } = this.#utils.searchByIdInSourceArticleQueries(id) ?? {}
    const { index: newIndex } = this.#utils.searchByIdInSourceArticleQueries(referenceId) ?? {}
    if (document && oldIndex && newIndex) {
      if (oldIndex[2] > newIndex[2]) {
        this.#utils.insertDocumentInSourceArticleQueries({
          index: SourceArticleIndex.increase(newIndex),
          document,
        })
      } else {
        this.#utils.insertDocumentInSourceArticleQueries({ index: newIndex, document })
      }

      await this.#apis.mutateMoveArticleAfter({ input: { id, target_id: referenceId } })
    }
  }

  async publishArticleKeepItsPublishedAt(record: ArticleDataSource.DocumentWithIndex) {
    const { id, published_at = 0 } = record.document
    const publishedAt = new Date((published_at as number) * 1000)
    const lastQuery = this.#sourceArticleQueries.value[this.#sourceArticleQueries.value.length - 1]
    let insertIndex: SourceArticleIndex.SourceArticleIndex | undefined
    if (lastQuery.total > 0) {
      const lastPage = lastQuery.hitsPerPage[lastQuery.hitsPerPage.length - 1]
      const oldestPublishedAt = lastPage.at(-1)?.published_at ?? 0
      if (published_at > oldestPublishedAt) {
        insertIndex = this.#utils.searchInSourceArticleQueries(
          (item) => published_at > (item.published_at ?? 0),
          SourceArticleIndex.refine([this.#sourceArticleQueries.value.length - 1, 0, 0]),
        )?.index
      }
    } else {
      insertIndex = SourceArticleIndex.refine([this.#sourceArticleQueries.value.length - 1, 0, 0])
    }
    this.#utils.registerArticleNextOperation(id, async () => {
      this.#utils.removeDocumentInSourceArticleQueries(record.index)
      if (insertIndex) {
        const newRecord = {
          index: insertIndex,
          document: {
            ...record.document,
            stage_id: Number(this.#stagesForView.value.ready.id),
            stage_name: this.#stagesForView.value.ready.name,
            published: true,
          },
        }
        this.#utils.insertDocumentInSourceArticleQueries(newRecord)
        await this.#apis.mutatePublishArticle({ id, time: publishedAt.toISOString(), now: true })
      } else {
        lastQuery.total += 1
        this.#utils.insertDocumentInSourceArticleQueries({
          index: SourceArticleIndex.refine([this.#sourceArticleQueries.value.length - 1, 0, 0]),
          document: {
            ...record.document,
            stage_id: Number(this.#stagesForView.value.ready.id),
            stage_name: this.#stagesForView.value.ready.name,
            published: true,
          },
        })
        await this.#apis.mutatePublishArticle({ id, time: publishedAt.toISOString(), now: true })
      }
    })
    if (await this.#notification?.notifyForPublishHasScheduledAndConfirmUndo({ key: id })) {
      // this will also wait for previous operation end
      await this.#utils.registerArticleNextOperation(id, async () => {
        if (insertIndex) {
          this.#utils.removeDocumentInSourceArticleQueries(insertIndex)
        } else {
          lastQuery.total -= 1
        }
        this.#utils.insertDocumentInSourceArticleQueries(record)
        await Promise.all([
          this.#apis.mutateChangeArticleStage({ input: { id, stage_id: `${record.document.stage_id}` } }),
          this.#apis.mutatePublishArticle({ id, time: publishedAt.toISOString() }),
        ])
      })
    }
  }

  async moveArticleToStage(record: ArticleDataSource.DocumentWithIndex, stageKey: string, index: number) {
    const newIndex = SourceArticleIndex.refine([
      this.#sourceArticleQueries.value.findIndex((item) => item.stageKey === stageKey) as number,
      Math.floor(index / 10),
      index % 10,
    ])
    const { id } = record.document
    const newStage = this.#stagesWithType.value.find((item) => getStageKey(item.id, item.type) === stageKey)
    const relatedDocument = this.#utils.getDocumentInSourceArticleQueries(newIndex)
    await this.#utils.moveArticleWithPivot(
      id,
      newIndex,
      relatedDocument?.id,
      (doc) => ({
        ...doc,
        stage_id: Number(newStage?.id),
        stage_name: newStage?.name ?? '',
      }),
      async () => {
        const temp = await this.#apis.mutateChangeArticleStage({ input: { id, stage_id: newStage?.id ?? '' } })
        if (index > 0 && relatedDocument === undefined) {
          const targetId = this.#mapStageKeyToArticlesForView.value?.get(stageKey)?.articles[index - 1].id
          await this.#apis.mutateMoveArticleAfter({ input: { id, target_id: targetId ?? '' } })
        } else if (relatedDocument !== undefined) {
          await this.#apis.mutateMoveArticleBefore({ input: { id, target_id: relatedDocument?.id ?? '' } })
        }
        return toUnixTimestamp(new Date(temp?.data?.changeArticleStage.updated_at))
      },
    )
    sendTrackUnchecked('article_stage_changed', {
      article_id: id,
      source: 'kanban',
      stage_id: newStage?.id,
      stage_name: newStage?.name,
    })
  }

  async movePublishedArticleToStage(record: ArticleDataSource.DocumentWithIndex, stageKey: string, index: number) {
    const { id, published_at } = record.document
    const newIndex = SourceArticleIndex.refine([
      this.#sourceArticleQueries.value.findIndex((item) => item.stageKey === stageKey) as number,
      Math.floor(index / 10),
      index % 10,
    ])
    const newStage = this.#stagesWithType.value.find((item) => getStageKey(item.id, item.type) === stageKey)
    const relatedDocument = this.#utils.getDocumentInSourceArticleQueries(newIndex)
    await this.#utils.moveArticleAndConfirmUndo(
      id,
      newIndex,
      (doc) => ({
        ...doc,
        stage_id: Number(newStage?.id),
        stage_name: newStage?.name ?? '',
        published: false,
        published_at: newStage?.type !== 'ready' ? published_at : undefined,
      }),
      async () => {
        const updatedAt =
          newStage?.type === 'ready'
            ? (await this.#apis.mutateUnpublishArticle({ id }))?.data?.unpublishArticle.updated_at
            : (await this.#apis.mutateChangeArticleStage({ input: { id, stage_id: newStage?.id ?? '' } }))?.data
                ?.changeArticleStage.updated_at

        if (index > 0 && relatedDocument === undefined) {
          const targetId = this.#mapStageKeyToArticlesForView.value?.get(stageKey)?.articles[index - 1].id
          await this.#apis.mutateMoveArticleAfter({ input: { id, target_id: targetId ?? '' } })
        } else if (relatedDocument !== undefined) {
          await this.#apis.mutateMoveArticleBefore({ input: { id, target_id: relatedDocument?.id ?? '' } })
        }

        return toUnixTimestamp(new Date(updatedAt))
      },
      (key) => this.#notification?.notifyForUnpublishAndConfirmUndo({ key }) ?? Promise.resolve(false),
      ({ from: { document } }) =>
        this.#apis.mutatePublishArticle({
          id,
          time: new Date((document.published_at ?? 0) * 1000).toISOString(),
          now: true,
        }),
    )
  }

  async moveArticleToDifferentStage(id: string, stageKey: string, index: number) {
    const record = Option.getOrUndefined(
      searchInSourceArticleQueries(
        this.#sourceArticleQueries.value,
        (item) => item.id === id,
        SourceArticleIndex.refine([0, 0, 0]),
      ),
    )
    if (!record) return
    const { document, index: oldIndex } = record
    const [, newStageType] = parseStageKey(stageKey)
    if (document && oldIndex && newStageType) {
      const [, type] = parseStageKey(this.#sourceArticleQueries.value[oldIndex[0]].stageKey)
      if (type !== 'published') {
        if (newStageType === 'ready') {
          if (document.published_at && document.published_at * 1000 < Date.now()) {
            await this.publishArticleKeepItsPublishedAt({ document, index: oldIndex })
          } else {
            await this.moveArticleToStage({ document, index: oldIndex }, stageKey, index)
          }
        } else if (newStageType === 'published') {
          await this.publishArticle(id)
        } else {
          await this.moveArticleToStage({ document, index: oldIndex }, stageKey, index)
        }
      } else if (newStageType === 'ready' || newStageType !== 'published') {
        await this.movePublishedArticleToStage({ document, index: oldIndex }, stageKey, index)
      }
    }
  }

  async moveArticleToDifferentDesk(id: string, deskId: string) {
    await this.#moveToDesk(id, deskId)
  }
}

export default ProviderMutationArticleClass

function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

export function useMoveToDesk({
  apis,
  currentDesk,
  utils,
  sourceArticleQueries,
}: UseMoveToDeskInput): UseMoveToDeskReturn {
  const { desks } = useDesks()
  const mapIdToDesk = computed(
    () =>
      new Map<string, DeskLike>(
        desks.value.flatMap((item): [string, DeskLike][] => [
          [item.id, item] satisfies [string, DeskLike],
          ...item.desks.map((subdesk) => [subdesk.id, { ...subdesk, desks: [] }] satisfies [string, DeskLike]),
        ]),
      ),
  )

  const isPresetDesk = computed(() => {
    const desk = toValue(currentDesk)

    return (
      desk.id === DEFAULT_DESK.ALL.id || desk.id === DEFAULT_DESK.FEATURED.id || desk.id === DEFAULT_DESK.MY_ARTICLES.id
    )
  })

  return {
    isPresetDesk,
    moveToDesk: async (id: string, deskId: string) => {
      if (mapIdToDesk.value.get(deskId)?.desks.length) return

      // find target desk includes subdesk
      const targetDesk = mapIdToDesk.value.get(deskId)

      if (!targetDesk) return

      const record = Option.getOrUndefined(
        searchInSourceArticleQueries(
          sourceArticleQueries.value,
          (item) => item.id === id,
          SourceArticleIndex.refine([0, 0, 0]),
        ),
      )

      if (!record) {
        return
      }

      // we are currently on preset desk or we are moving an article into current desk's subdesk
      if (isPresetDesk.value || toValue(currentDesk).desks.some((item) => item.id === deskId)) {
        // update in local cache
        utils.updateDocument({
          ...record.document,
          desk_id: Number(deskId),
          desk_name: targetDesk.name,
        })
      } else {
        // This article is not belong to current desk anymore, remove it
        utils.removeDocumentInSourceArticleQueries(record.index)
      }

      // Execute the API
      await utils.registerArticleNextOperation(id, async () => {
        await apis.mutateMoveArticleToDesk({ id, desk_id: deskId })
      })
    },
  }
}
