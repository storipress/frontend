import type { Ref } from 'vue'
import { sortBy } from 'lodash-es'
import invariant from 'tiny-invariant'
import type { NewStageInputData, SortByInput, StageQueryResult, UpdateStageInputData } from './definition'
import type ProviderMutationUtils from './ProviderMutationUtils'
import type { CardAPI } from './card-apis'
import { useCardRelatedAPI } from './card-apis'
import { getStageKey } from './ArticleDataSource'
import { GetStagesDocument } from '~/graphql-operations'

export default class ProviderMutationClass {
  #utils: ProviderMutationUtils
  #apis: CardAPI
  #sourceArticleQueries: Ref<StageQueryResult[]>
  #mapAfterIdToDraftStages: Ref<Map<string, NewStageInputData[]>>
  #mapIdToKey: Ref<Map<string, string>>
  constructor(
    utils: ProviderMutationUtils,
    sourceArticleQueries: Ref<StageQueryResult[]>,
    mapAfterIdToDraftStages: Ref<Map<string, NewStageInputData[]>>,
    mapIdToKey: Ref<Map<string, string>>,
  ) {
    this.#utils = utils
    this.#apis = useCardRelatedAPI()
    this.#sourceArticleQueries = sourceArticleQueries
    this.#mapAfterIdToDraftStages = mapAfterIdToDraftStages
    this.#mapIdToKey = mapIdToKey
  }

  async sortBy({ stage, type, sort }: SortByInput) {
    await this.#utils.setSortBy(getStageKey(stage, type), sort)
  }

  addDraftStage(afterId: string) {
    const draftStage: NewStageInputData = {
      draftId: Math.random().toString(16).slice(2),
      name: '',
      color: '#ef4444',
      icon: 'preview',
    }
    if (this.#mapAfterIdToDraftStages.value.has(afterId)) {
      this.#mapAfterIdToDraftStages.value.get(afterId)?.unshift(draftStage)
    } else {
      this.#mapAfterIdToDraftStages.value.set(afterId, [draftStage])
    }
  }

  removeDraftStage(draftId: string) {
    for (const drafts of this.#mapAfterIdToDraftStages.value.values()) {
      const index = drafts.findIndex((stage) => stage.draftId === draftId)
      if (index !== -1) {
        drafts.splice(index, 1)
        break
      }
    }
  }

  async addStage(data: NewStageInputData) {
    let after = ''
    let groupA: NewStageInputData[] = []
    let groupB: NewStageInputData[] = []
    const { draftId, ...input } = data
    for (const [stageId, drafts] of this.#mapAfterIdToDraftStages.value.entries()) {
      const index = drafts.findIndex((stage) => stage.draftId === draftId)
      if (index !== -1) {
        after = stageId
        groupA = drafts.slice(0, index)
        groupB = drafts.slice(index + 1)
        break
      }
    }
    const mapIdToKey = this.#mapIdToKey
    const mapAfterIdToDraftStages = this.#mapAfterIdToDraftStages
    const result = await this.#apis.mutateCreateStage(
      { input: { after, ...input } },
      {
        update(cache, result) {
          const newStage = result?.data?.createStage
          const data = cache.readQuery({ query: GetStagesDocument })
          if (newStage && data?.stages) {
            const stages = sortBy([newStage, ...data.stages], ({ order }) => order)
            cache.writeQuery({ query: GetStagesDocument, data: { stages } })
            mapIdToKey.value.set(newStage.id, draftId)
            const newStageId = newStage.id
            mapAfterIdToDraftStages.value.set(after, groupA)
            mapAfterIdToDraftStages.value.set(newStageId, groupB)
          }
        },
      },
    )
    sendTrackUnchecked('kanban_stage_created', {
      stage_id: result?.data?.createStage.id,
      stage_name: result?.data?.createStage.name,
    })
  }

  async updateStage(stageId: string, data: UpdateStageInputData) {
    await this.#apis.mutateUpdateStage({ input: { id: stageId, ...data } })
  }

  async removeStage(stageId: string) {
    const sourceStage = this.#sourceArticleQueries.value.find(({ stageKey }) => stageKey.startsWith(stageId))
    invariant(sourceStage, 'sourceStagecan not be found')
    const sourceStageKey = sourceStage.stageKey
    const sourceStageIndex = this.#sourceArticleQueries.value.findIndex(({ stageKey }) => stageKey === sourceStageKey)
    invariant(sourceStageIndex !== -1, 'sourceStageIndex can not be found')
    invariant(sourceStageIndex !== 0, 'can not remove first stage')

    const leftStageKey = this.#sourceArticleQueries.value[sourceStageIndex - 1].stageKey
    this.#utils.moveAllArticleToStage(sourceStageKey, leftStageKey)

    const result = await this.#apis.mutateDeleteStage({ id: stageId })
    this.#mapIdToKey.value.delete(stageId)
    sendTrackUnchecked('kanban_stage_removed', {
      stage_id: result?.data?.deleteStage.id,
      stage_name: result?.data?.deleteStage.name,
    })
  }

  async queryNextPageByStageIdAndType(stageId: string, type: string) {
    const key = getStageKey(stageId, type)
    const stageQueryResult = this.#sourceArticleQueries.value.find(({ stageKey }) => stageKey === key)
    if (stageQueryResult) {
      await this.#utils.loadPage(stageQueryResult, (stageQueryResult.query.page ?? 0) + 1)
    }
  }
}
