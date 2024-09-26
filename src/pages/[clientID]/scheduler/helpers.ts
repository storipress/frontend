import { useFuse } from '@vueuse/integrations/useFuse'
import type { MaybeRef } from '@vueuse/core'
import type { Ref } from 'vue'
import type { ListArticlesQueryVariables } from '~/graphql-operations'
import { ListArticlesDocument } from '~/graphql-operations'
import { useSearchConditionStore } from '~/stores/search-condition'
import type { Article } from '~/components/Scheduler'
import { normalizeArticle } from '~/components/Scheduler'
import { useArticlePermission } from '~/composables'

export function useFilteredArticles(
  variables: MaybeRef<ListArticlesQueryVariables>,
): Readonly<[Ref<Article[] | undefined>, Ref<boolean>]> {
  const { canEdit } = useArticlePermission()
  const { result, loading } = useQuery(ListArticlesDocument, variables)
  const searchConditionStore = useSearchConditionStore()
  const { results } = useFuse(
    computed(() => searchConditionStore.text || ''),
    computed(() => {
      const tags = new Set(searchConditionStore.tags?.map(({ id }) => id) ?? [])
      const authors = new Set(searchConditionStore.people?.map(({ id }) => id) ?? [])
      const desks = new Set(
        searchConditionStore.desks?.flatMap(({ id, desks }) => {
          const subDeskIds = desks?.map(({ id }) => id) ?? []
          return [id, ...subDeskIds]
        }) ?? [],
      )

      return (result.value?.articles || []).filter((article) => {
        // happy path
        if (tags.size === 0 && authors.size === 0 && desks.size === 0) {
          return true
        }
        if (tags.size > 0 && !article.tags.some((tag) => tags.has(tag.id))) {
          return false
        }

        if (authors.size > 0 && !article.authors.some((author) => authors.has(author.id))) {
          return false
        }

        if (desks.size > 0 && !desks.has(article.desk.id)) {
          return false
        }

        return true
      })
    }),
    {
      fuseOptions: {
        keys: ['title'],
      },
      matchAllWhenSearchEmpty: true,
    },
  )
  return [
    computed(() =>
      result.value?.articles !== undefined
        ? results.value.map(({ item }) => normalizeArticle(item, (article) => canEdit(article).value))
        : undefined,
    ),
    loading,
  ]
}
