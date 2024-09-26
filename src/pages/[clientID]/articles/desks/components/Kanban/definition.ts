import type { ComputedRef, InjectionKey } from 'vue'
import type { MultiSearchRequestSchema } from 'typesense/src/Typesense/MultiSearch'
import { SortArticleBy } from './search-query-provider'
import type { GetStagesQuery } from '~/graphql-operations'

export enum CardStatus {
  Edit = 'edit',
  Published = 'published',
  Unpublished = 'unpublished',
}
export interface TypesenseArticleDocument {
  desk_id: number
  desk_name: string
  stage_id: number
  stage_name: string
  title: string
  slug?: string
  blurb?: string
  featured: boolean
  cover?: string
  order: number
  author_ids: string[]
  author_names: string[]
  author_avatars: string[]
  tag_ids: number[]
  tag_names: string[]
  published: boolean
  published_at?: number
  created_at: number
  updated_at: number
  id: string
}
export interface CardPropsInterface {
  id: string
  title: string
  desk: string
  status: CardStatus
  featured: boolean
  editedAt: Date
  publishedAt?: Date
  order: number
  avatars: {
    name: string
    src: string
  }[]
  disabled: boolean
}

export type StageWithType = GetStagesQuery['stages'][0] & {
  key?: string
  type: 'default' | 'custom' | 'ready' | 'published'
}

export interface NewStageInputData {
  draftId: string
  color: string
  icon: string
  name: string
}

export interface UpdateStageInputData {
  color: string
  icon: string
  name: string
}

export interface StagesForView {
  default: StageWithType
  customs: (StageWithType | NewStageInputData)[]
  ready: StageWithType
  published: StageWithType
}

export interface StageQueryResult {
  stageKey: string
  query: MultiSearchRequestSchema
  total: number
  hitsPerPage: TypesenseArticleDocument[][]
}

export interface OverwriteArticle {
  newStageKey?: string
  oldStageKey: string
  article: CardPropsInterface
}

export interface StageArticles {
  total: number
  articles: CardPropsInterface[]
}

export interface KanbanState {
  deskId: string
  stagesForView: StagesForView
  mapStageKeyToArticlesForView: Map<string, StageArticles>
  isLoading: boolean
  getStageKey(stageId: string, type: string): string
  getStageByKey: (stageKey: string) => GetStagesQuery['stages'][0] | undefined
  parseStageKey: (stageKey: string) => [string, string]
}

export const DEFAULT_KANBAN_STATE: KanbanState = {
  deskId: '',
  stagesForView: {
    default: { id: '', name: '', color: '', icon: '', order: 1, ready: false, default: true, type: 'default' },
    customs: [],
    ready: { id: '', name: '', color: '', icon: '', order: 1, ready: true, default: false, type: 'ready' },
    published: { id: '', name: '', color: '', icon: '', order: 1, ready: true, default: false, type: 'published' },
  },
  mapStageKeyToArticlesForView: new Map(),
  isLoading: false,
  getStageKey: () => '',
  getStageByKey: () => undefined,
  parseStageKey: () => ['', ''],
}

export interface SortByItem {
  text: string
  sort: SortArticleBy
}

export const sortByList: SortByItem[] = [
  {
    text: 'Date created (newest first)',
    sort: SortArticleBy.CreatedDesc,
  },
  {
    text: 'Date created (oldest first)',
    sort: SortArticleBy.CreatedAsc,
  },
  {
    text: 'Article name (a-z)',
    sort: SortArticleBy.TitleAsc,
  },
  {
    text: 'Article name (z-a)',
    sort: SortArticleBy.TitleDesc,
  },
]

export const stateKey = Symbol('Kanban-state') as InjectionKey<ComputedRef<KanbanState>>

export interface SortByInput {
  stage: string
  type: string
  sort: SortArticleBy
}

export const mutationKey = Symbol('Kanban-mutation') as InjectionKey<{
  publishArticle: (id: string) => Promise<void>
  unpublishArticle: (id: string) => Promise<void>
  unscheduleArticle: (id: string) => Promise<void>
  changeFeatureArticle: (id: string, value: boolean) => Promise<void>
  deleteArticle: (id: string) => Promise<void>
  duplicateArticle: (id: string) => Promise<void>
  moveArticleBefore: (id: string, referenceId: string) => Promise<void>
  moveArticleAfter: (id: string, referenceId: string) => Promise<void>
  moveArticleToDifferentStage: (id: string, stageKey: string, index: number) => Promise<void>
  moveArticleToDifferentDesk: (id: string, deskId: string) => Promise<void>

  sortBy: (input: SortByInput) => Promise<void>
  addDraftStage: (afterId: string) => void
  removeDraftStage: (draftId: string) => void
  addStage: (data: NewStageInputData) => Promise<void>
  updateStage: (stageId: string, data: UpdateStageInputData) => Promise<void>
  removeStage: (stageId: string) => Promise<void>
  queryNextPageByStageIdAndType: (stageId: string, type: string) => Promise<void>

  setDragging(dragging: boolean): void
}>

export function useKanbanState(): ComputedRef<KanbanState> {
  const defaultValue = computed<KanbanState>(() => DEFAULT_KANBAN_STATE)
  return inject(stateKey, defaultValue)
}

export function useKanbanMutation() {
  return inject(mutationKey)
}
