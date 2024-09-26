import type { Ref } from 'vue'
import { stubTrue } from 'lodash-es'
import type { Article, Location, Stage } from './definitions'
import { useSchedulerStore } from './store'
import type { Article as ApiArticle, User as ApiUser } from '~/graphql-operations'
import { ArticlePlan, ChangeArticleStageDocument, GetArticleDocument, GetSiteDocument } from '~/graphql-operations'
import { dayjs } from '~/lib/dayjs'
import { isAdmin } from '~/composables'
import { getAvatarURL } from '~/lib/avatar'

export { useStages } from '~/composables/stages'

export interface UseStageReturn {
  stageName: Readonly<Ref<string>>
  indicatorColors: Readonly<Ref<Record<string, string>>>
  indicatorColor: Readonly<Ref<string>>
}

export { getWholeMonth } from '~/lib/calendar'

export function useStage(id: Ref<string>, stages: Ref<Stage[]>): UseStageReturn {
  const indicatorColors = computed(() => {
    return Object.fromEntries(stages.value.map((stage) => [stage.id, stage.color]))
  })

  const indicatorColor = computed(() => {
    return indicatorColors.value[id.value]
  })

  const stageName = computed(() => {
    return stages.value.find((stage) => stage.id === id.value)?.name ?? ''
  })

  return {
    stageName,
    indicatorColor,
    indicatorColors,
  }
}

export function useMutateStage(stages: Readonly<Ref<Stage[]>>, article: Readonly<Ref<Article>>) {
  const { mutate: mutateArticleStage } = useMutation(ChangeArticleStageDocument)

  return async ({ id, stageId }: { id: string; stageId: string }) => {
    const stage = stages.value.find((stage) => stage.id === stageId)
    await mutateArticleStage(
      {
        input: {
          id,
          stage_id: stageId,
        },
      },
      {
        optimisticResponse: {
          __typename: 'Mutation',
          changeArticleStage: {
            __typename: 'Article',
            id,
            title: article.value.title,
            slug: '',
            blurb: '',
            featured: false,
            cover: '',
            seo: '',
            plan: ArticlePlan.Free,
            updated_at: Math.floor(Date.now() / 1000),
            stage: {
              __typename: 'Stage',
              id: stageId,
              name: stage?.name ?? '',
              color: stage?.color ?? '',
              icon: stage?.icon ?? '',
              default: stage?.default ?? false,
              order: stage?.order ?? 0,
            },
          },
        },
        update: (cache, { data }) => {
          const res = cache.readQuery<{ article: ApiArticle }>({
            query: GetArticleDocument,
            variables: { id },
          })
          if (!res || !data?.changeArticleStage) {
            return
          }
          cache.writeQuery({
            query: GetArticleDocument,
            data: {
              article: {
                ...res.article,
                stage: data.changeArticleStage.stage,
              },
            },
          })
        },
      },
    )
  }
}

export function isSchedulable(article: Article, role: string, loc: Location | undefined): boolean {
  if (!loc) {
    return true
  }

  if (isAdmin(role)) {
    return true
  }

  // early return when the article is in navigation + user is contributor
  if (role === 'contributor') {
    return false
  }

  // check editable if:
  // 1. user is editor or author
  // 2. user is contributor and article is in calendar
  return article.editable
}

type RawUser = Pick<ApiUser, 'id' | 'full_name' | 'avatar'>
type RawStage = Pick<ApiArticle['stage'], 'id' | 'name' | 'color' | 'order' | 'icon'>
export type RawArticle = Pick<
  ApiArticle,
  'title' | 'id' | 'scheduled' | 'published_at' | 'published' | 'updated_at'
> & {
  authors: RawUser[]
  desk: { id: string }
  stage: RawStage
}

export function normalizeArticles(articles: RawArticle[]): Article[] {
  return articles.map((article) => normalizeArticle(article))
}

export function normalizeArticle(
  { title, authors, id, stage, desk, published_at, updated_at, published }: RawArticle,
  isEditable: (article: { id: string; desk: { id: string }; authors: { id: string }[] }) => boolean = stubTrue,
): Article {
  return {
    id,
    title,
    stage,
    desk,
    editable: isEditable({ id, desk, authors }),
    authors: authors.map(({ id, full_name, avatar }) => ({
      id,
      name: full_name || '',
      avatar: avatar ?? getAvatarURL(full_name),
    })),
    // must not be `null` or it will break dayjs
    scheduledAt: published_at || undefined,
    updatedAt: dayjs(updated_at).unix(),
    published,
  }
}

export function useScheduler() {
  const { result } = useQuery(GetSiteDocument)
  const today = ref<dayjs.Dayjs>()
  const store = useSchedulerStore()
  const currentDay = toRef(store, 'currentDay')
  const range = computed(() => ({
    range: { from: store.range.from, to: store.range.to },
  }))

  whenever(result, (res) => {
    store.timezone = res.site.timezone
    today.value = dayjs().tz(store.timezone)
    currentDay.value = today.value
  })

  return {
    today,
    store,
    currentDay,
    range,
  }
}
