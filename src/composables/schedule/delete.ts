import type { MaybeRef } from '@vueuse/core'
import { useCancelableNotification } from '../notification'
import { DeleteArticleDocument, ListArticlesDocument } from '~/graphql-operations'

interface ArticleInput {
  id: string
}

export function useDeleteArticle(
  rangeFilter?: MaybeRef<{ from: string; to: string } | undefined>,
): (input: ArticleInput) => Promise<void> {
  const { mutate } = useCancelableMutation(DeleteArticleDocument)
  const { create } = useCancelableNotification()

  return async (input: ArticleInput) => {
    const { id } = input
    const variables = { id }
    const userResponse = create({ preset: 'articleDeleted' })
    await mutate(userResponse, variables, {
      optimisticResponse: {
        __typename: 'Mutation',
        deleteArticle: {
          __typename: 'Article',
          id,
        },
      },
      refetchQueries: [
        { query: ListArticlesDocument, variables: { range: unref(rangeFilter) } },
        { query: ListArticlesDocument, variables: { unscheduled: true } },
      ],
      update(cache) {
        cache.evict({ id })
        cache.updateQuery({ query: ListArticlesDocument, variables: { range: unref(rangeFilter) } }, (data) => {
          if (!data) return
          return { articles: data.articles.filter((a) => a.id !== id) }
        })
        cache.updateQuery({ query: ListArticlesDocument, variables: { unscheduled: true } }, (data) => {
          if (!data) return
          return { articles: data.articles.filter((a) => a.id !== id) }
        })
      },
    })
  }
}
