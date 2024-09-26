import type { MultiSearchRequestSchema } from 'typesense/lib/Typesense/MultiSearch'
import { exclude } from 'tsafe'
import invariant from 'tiny-invariant'
import { P, match } from 'ts-pattern'
import { DEFAULT_ITEM as DEFAULT_DESK } from '../LeftHandNavPanel'
import { cardHeight, publishedCardHeight } from './setting'
import type { StageWithType, TypesenseArticleDocument } from './definition'
import { useSearchConditionStore } from '~/stores/search-condition'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useDesks } from '~/composables/desks'
import { useMe } from '~/composables/me'

interface DeskLike {
  id: string
  desks?: DeskLike[]
}

type StageLike = Pick<StageWithType, 'id' | 'type'>

interface QueryObject {
  stage_id: string
  published: boolean
  desk_id?: string[]
  featured?: boolean
  author_ids?: string | string[]
  tag_ids?: string[]
  plan?: string[]
  published_at?: [Date, Date]
  created_at?: [Date, Date]
}

const REQUIRED_FIELDS: (keyof TypesenseArticleDocument)[] = [
  'desk_id',
  'desk_name',
  'stage_id',
  'stage_name',
  'title',
  'slug',
  'blurb',
  'featured',
  'cover',
  'order',
  'author_ids',
  'author_names',
  'author_avatars',
  'tag_ids',
  'tag_names',
  'published',
  'published_at',
  'created_at',
  'updated_at',
  'id',
]

export enum SortArticleBy {
  TitleAsc = 'title:asc',
  TitleDesc = 'title:desc',
  CreatedAsc = 'created_at:asc',
  CreatedDesc = 'created_at:desc',
  UpdateAsc = 'updated_at:asc',
  UpdateDesc = 'updated_at:desc',
}

export function createSortBy(stage: StageLike, sortBy = SortArticleBy.TitleAsc): string {
  const sortQueries = stage.type === 'published' ? ['published_at:desc'] : []
  return [...sortQueries, sortBy].join(',')
}

export function useQueryProvider() {
  const searchConditionStore = useSearchConditionStore()
  const me = useMe()
  const { canAddDesk } = usePublicationPermission()

  const { height } = useWindowSize()

  const { desks } = useDesks()
  const mapIdToDesk = computed(() => new Map(desks.value.map((item) => [item.id, item])))

  const canAccessDeskIdSet = computed(() => {
    return new Set([
      ...(me.value?.desks || [])
        .map((desk) => desk.id)
        .flatMap((id) => {
          const desk = mapIdToDesk.value.get(id)
          return desk?.desks.length ? [id, ...desk.desks.map((item) => item.id)] : id
        }),
      ...(desks.value || [])
        .filter(({ open_access }) => open_access)
        .flatMap(({ id, desks }) => [id, ...desks.map(({ id }) => id)]),
    ])
  })

  const getDeskConditionIds = () => {
    if (!searchConditionStore.desks?.length) return []

    const deskIds = searchConditionStore.desks.flatMap(({ id, desks }) => {
      const subDeskIds = desks?.map(({ id }) => id) ?? []
      return [id as string, ...subDeskIds]
    })

    return [...new Set(deskIds)]
  }

  return {
    canAccessDeskIdSet,

    searchConditionSummary: computed(() => ({
      meId: me.value?.id,
      searchText: searchConditionStore.text,
      people: extractIds(searchConditionStore.people),
      tags: extractIds(searchConditionStore.tags),
      desks: extractIds(searchConditionStore.desks),
      plans: searchConditionStore.plans?.map((item) => item.key) ?? [],
      canAssessDesks: Array.from(canAccessDeskIdSet.value),
    })),

    constructQuery: (currentDesk: DeskLike, stage: StageLike): MultiSearchRequestSchema => {
      const filterObject: QueryObject = {
        stage_id: stage.id,
        published: stage.type === 'published',
        desk_id: getDeskConditionIds(),
        featured: undefined,
        author_ids: undefined,
        tag_ids: undefined,
        plan: undefined,
        published_at: undefined,
        created_at: undefined,
      }

      switch (currentDesk.id) {
        case DEFAULT_DESK.ALL.id:
          if (!canAddDesk.value) {
            const deskConditionIds = getDeskConditionIds()
            const deskIds = deskConditionIds.length
              ? [...canAccessDeskIdSet.value].filter((id) => deskConditionIds.includes(id))
              : [...canAccessDeskIdSet.value]
            filterObject.desk_id = deskIds
            break
          }
          break
        case DEFAULT_DESK.FEATURED.id:
          filterObject.featured = true
          break
        case DEFAULT_DESK.MY_ARTICLES.id:
          filterObject.author_ids = me.value?.id ?? ''
          break
        default:
          filterObject.desk_id = [currentDesk.id, ...extractIds(currentDesk.desks)]
      }

      // this is necessary or on `my article` page will have wrong result
      if (searchConditionStore.people?.length) {
        filterObject.author_ids = extractIds(searchConditionStore.people)
      }

      if (searchConditionStore.tags?.length) {
        filterObject.tag_ids = extractIds(searchConditionStore.tags)
      }

      if (searchConditionStore.plans?.length) {
        filterObject.plan = searchConditionStore.plans.map(({ key }) => key)
      }

      if (searchConditionStore.range?.length) {
        if (stage.type === 'published') {
          filterObject.published_at = searchConditionStore.range
        } else {
          filterObject.created_at = searchConditionStore.range
        }
      }

      const perPage = Math.max(
        10,
        Math.ceil(height.value / (stage.type === 'published' ? publishedCardHeight : cardHeight)),
      )
      return {
        // skipcq: JS-W1043
        q: searchConditionStore.text || '*',
        query_by: 'title,content',
        collection: 'articles',
        filter_by: buildFilterQuery(filterObject as unknown as FilterObject),
        sort_by: createSortBy(stage),
        highlight_full_fields: 'title',
        per_page: perPage,
        include_fields: REQUIRED_FIELDS.join(),
        page: 1,
      }
    },
  }
}

export function extractIds(xs?: { id?: string }[]): string[] {
  return xs?.map(({ id }) => id).filter(exclude(undefined)) ?? []
}

export function toUnixTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000)
}

interface FilterObject {
  [key: string]: string | string[] | boolean | [Date, Date] | undefined
}

export function buildFilterQuery<T extends FilterObject>(filterObject: T) {
  const filterQuery = Object.entries(filterObject)
    .filter(([_, value]) => value !== undefined && (!Array.isArray(value) || value.length > 0))
    .map(([key, value]) => buildFilterComponent(key, value))
    .join(' && ')

  return filterQuery
}

function buildFilterComponent(key: string, value: string | string[] | [Date, Date] | boolean | undefined) {
  invariant(value !== undefined, 'filter value is undefined')
  return match(value)
    .with(
      [P.instanceOf(Date), P.instanceOf(Date)],
      ([start, end]) => `${key}:[${toUnixTimestamp(start)}..${toUnixTimestamp(end)}]`,
    )
    .with(P.union(P.string, P.boolean), (value) => `${key}:=${value}`)
    .with(P.array(P.string), (value) => `${key}:[${value.join()}]`)
    .exhaustive()
}
