<script setup lang="ts">
import { defineProps } from 'vue'
import { sortBy, uniqBy } from 'lodash-es'
import type { MultiSearchRequestSchema } from 'typesense/src/Typesense/MultiSearch'
import { key as NotificationKey } from '@storipress/core-component'
import { hash } from 'ohash'
import { computedAsync } from '@vueuse/core'
import { Array, Duration, Effect, Fiber, Schedule, pipe } from 'effect'
import { useRouteQuery } from '@vueuse/router'
import { CardStatus, mutationKey, stateKey } from './definition'
import Kanban from './Kanban.vue'
import type {
  CardPropsInterface,
  KanbanState,
  NewStageInputData,
  StageArticles,
  StageQueryResult,
  StageWithType,
  StagesForView,
  UpdateStageInputData,
} from './definition'
import ProviderMutationUtils from './ProviderMutationUtils'
import ProviderMutationArticleClass from './ProviderMutationArticleClass'
import ProviderMutationStageClass from './ProviderMutationStageClass'
import { extractIds, useQueryProvider } from './search-query-provider'
import { ArticleDataSource } from './ArticleDataSource'
import type { GetStagesQuery, ListDesksQuery } from '~/graphql-operations'
import { GetStagesDocument } from '~/graphql-operations'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useMe } from '~/composables/me'
import { useApiLive, useEffectScoped } from '~/effects'
import { env } from '~/env'

export interface Props {
  desk: ListDesksQuery['desks'][0]
}

const props = defineProps<Props>()

function getStageKey(stageId: string, stageType: string) {
  return `${stageId}-${stageType}`
}
function parseStageKey(stageKey: string): [string, string] {
  const temp = stageKey.split('-')
  return [temp[0], temp[1]]
}
const notification = inject(NotificationKey)

const { result: sourceStages } = useQuery<GetStagesQuery>(GetStagesDocument)
const stagesWithType = computed<StageWithType[]>(() => {
  if (sourceStages.value?.stages) {
    const defaultStage = sourceStages.value.stages.find((stage) => stage.default)
    const customStages = sourceStages.value.stages.filter((stage) => !stage.default && !stage.ready)
    const readyStage = sourceStages.value.stages.find((stage) => stage.ready)
    if (defaultStage && customStages && readyStage) {
      const defaultStageWithType: StageWithType = { ...defaultStage, type: 'default' }
      const readyStageWithType: StageWithType = { ...readyStage, type: 'ready' }
      const livedStageWithType: StageWithType = { ...readyStage, type: 'published' }
      return [
        defaultStageWithType,
        ...sortBy(
          customStages.map<StageWithType>((stage) => ({ ...stage, type: 'custom' })),
          ({ order }) => order,
        ),
        readyStageWithType,
        livedStageWithType,
      ]
    }
  }

  return []
})
const mapAfterIdToDraftStages = ref<Map<string, NewStageInputData[]>>(new Map()) // prepare overwrite arguments
const mapIdToKey = ref<Map<string, string>>(new Map()) // prepare overwrite arguments
const stagesForView = computed<StagesForView>(() => {
  const customs: (StageWithType | NewStageInputData)[] = []
  stagesWithType.value.slice(0, stagesWithType.value.length - 2).forEach((stage) => {
    if (!stage.default) {
      customs.push(stage)
      stage.key = mapIdToKey.value.get(stage.id)
    }
    const temp = mapAfterIdToDraftStages.value.get(stage.id)
    if (temp) customs.push(...temp)
  })
  return {
    default: stagesWithType.value[0],
    customs,
    ready: stagesWithType.value[stagesWithType.value.length - 2],
    published: stagesWithType.value[stagesWithType.value.length - 1],
  }
})

const { canUpdateDesk } = usePublicationPermission()
const canUpdateAllArticle = canUpdateDesk(computed(() => props.desk))
const me = useMe()
const { constructQuery, canAccessDeskIdSet, searchConditionSummary } = useQueryProvider()

const ApiLive = useApiLive()
const { runPromise, runSync, runFork } = useEffectScoped()
const articleDataSource = computedAsync(() =>
  pipe(ArticleDataSource.makeFromApi(), Effect.provide(ApiLive), runPromise),
)

const refreshInterval = useRouteQuery<string>('refresh_interval', '60')

watchEffect((onCleanup) => {
  if (!articleDataSource.value) {
    return
  }
  // disable refresh for fully local test
  if (env.MODE !== 'production' && refreshInterval.value === 'inf') {
    return
  }
  const intervalRaw = Number.parseInt(refreshInterval.value)
  const interval = Number.isNaN(intervalRaw) || env.MODE === 'production' ? 60 : intervalRaw
  // setup daemon to refresh Kanban every 1m
  const fiber = runFork(
    pipe(
      ArticleDataSource.refreshAll(articleDataSource.value),
      Effect.repeat(Schedule.spaced(Duration.seconds(interval))),
    ),
  )

  onCleanup(() => {
    Fiber.interrupt(fiber)
  })
})

const utils = new ProviderMutationUtils(
  stagesWithType,
  me,
  articleDataSource as Ref<ArticleDataSource.ArticleDataSource>,
)
const sourceArticleQueries = computed(() => articleDataSource.value?.sourceQueryRef.value ?? [])

watch(
  () => [props.desk?.id, ...extractIds(stagesWithType.value), hash(searchConditionSummary.value)].join(),
  async (newCondition, oldCondition) => {
    if (!articleDataSource.value) {
      return
    }

    if (newCondition !== oldCondition) {
      runSync(ArticleDataSource.clear(articleDataSource.value))
      await notification?.closeAll()
    }
    if (stagesWithType.value && stagesWithType.value.length > 0 && utils.isReady && me.value?.id) {
      const searches = stagesWithType.value.map((stage): MultiSearchRequestSchema => constructQuery(props.desk, stage))
      const stageQueries = searches.map<StageQueryResult>((search, index) => {
        const stage = stagesWithType.value[index]
        return {
          stageKey: getStageKey(stage.id, stage.type),
          query: search,
          hitsPerPage: [],
          total: 0,
        }
      })
      await runPromise(ArticleDataSource.setQueries(articleDataSource.value, stageQueries))
      await utils.refreshByStageKeys(stageQueries.map((query) => query.stageKey))
    }
  },
)

const mapStageKeyToArticlesForView = computed<Map<string, StageArticles>>(() => {
  return new Map<string, StageArticles>(
    sourceArticleQueries.value.map(({ stageKey, total, hitsPerPage }) => [
      stageKey,
      {
        total,
        articles: uniqBy(
          hitsPerPage.flat(1).map<CardPropsInterface>((document) => {
            return {
              id: document.id,
              title: document.title,
              desk: document.desk_name,
              status: stageKey.endsWith('published')
                ? CardStatus.Published
                : document.published_at
                  ? CardStatus.Unpublished
                  : CardStatus.Edit,
              featured: document.featured,
              editedAt: new Date(document.updated_at * 1000),
              publishedAt: document.published_at ? new Date(document.published_at * 1000) : undefined,
              order: document.order,
              avatars: pipe(
                Array.zip(document.author_names ?? [], document.author_avatars ?? []),
                Array.map(([name, src]) => ({ name, src })),
              ),
              disabled: !(
                canUpdateAllArticle.value ||
                (canAccessDeskIdSet.value.has(`${document.desk_id}`) &&
                  (me.value?.role === 'editor' || document.author_ids.includes(me.value?.id ?? '')))
              ),
            }
          }),
          ({ id }) => id,
        ),
      },
    ]),
  )
})

const isLoading = computed<boolean>(() => {
  return sourceStages.value === undefined || sourceArticleQueries.value.every((res) => res.hitsPerPage.length === 0)
})

provide(
  stateKey,
  computed<KanbanState>(() => ({
    deskId: props.desk.id,
    stagesForView: stagesForView.value,
    mapStageKeyToArticlesForView: mapStageKeyToArticlesForView.value,
    isLoading: isLoading.value,
    getStageKey,
    getStageByKey: (stageKey: string) => {
      const key = stageKey.replace(/-.*$/, '')
      return sourceStages.value?.stages.find((stage) => stage.id === key)
    },
    parseStageKey,
  })),
)

const mutationArticleObject = new ProviderMutationArticleClass(
  utils,
  stagesForView,
  stagesWithType,
  notification,
  sourceArticleQueries,
  mapStageKeyToArticlesForView,
  computed<ListDesksQuery['desks'][0]>(() => props.desk),
)
const mutationStageObject = new ProviderMutationStageClass(
  utils,
  sourceArticleQueries,
  mapAfterIdToDraftStages,
  mapIdToKey,
)

provide(mutationKey, {
  publishArticle: (id: string) => mutationArticleObject.publishArticle(id),
  unpublishArticle: (id: string) => mutationArticleObject.unpublishArticle(id),
  unscheduleArticle: (id: string) => mutationArticleObject.unscheduleArticle(id),
  changeFeatureArticle: (id: string, value: boolean) => mutationArticleObject.changeFeatureArticle(id, value),
  deleteArticle: (id: string) => mutationArticleObject.deleteArticle(id),
  duplicateArticle: (id: string) => mutationArticleObject.duplicateArticle(id),
  moveArticleBefore: (id: string, referenceId: string) => mutationArticleObject.moveArticleBefore(id, referenceId),
  moveArticleAfter: (id: string, referenceId: string) => mutationArticleObject.moveArticleAfter(id, referenceId),
  moveArticleToDifferentStage: (id: string, stageKey: string, index: number) =>
    mutationArticleObject.moveArticleToDifferentStage(id, stageKey, index),
  moveArticleToDifferentDesk: (id: string, deskId: string) =>
    mutationArticleObject.moveArticleToDifferentDesk(id, deskId),

  sortBy: (input) => mutationStageObject.sortBy(input),
  addDraftStage: (afterId: string) => mutationStageObject.addDraftStage(afterId),
  removeDraftStage: (draftId: string) => mutationStageObject.removeDraftStage(draftId),
  addStage: (data: NewStageInputData) => mutationStageObject.addStage(data),
  updateStage: (stageId: string, data: UpdateStageInputData) => mutationStageObject.updateStage(stageId, data),
  removeStage: (stageId: string) => mutationStageObject.removeStage(stageId),
  queryNextPageByStageIdAndType: (stageId: string, type: string) =>
    mutationStageObject.queryNextPageByStageIdAndType(stageId, type),

  setDragging(dragging) {
    if (articleDataSource.value) {
      articleDataSource.value.isDragging = dragging
    }
  },
})
</script>

<template>
  <Kanban :desk="desk" v-bind="$attrs" />
  <slot></slot>
</template>
