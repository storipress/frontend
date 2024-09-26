import invariant from 'tiny-invariant'
import type { NotificationFactory } from '@storipress/core-component'
import { NOTIFICATION_KEY } from '@storipress/core-component'
import { useCancelableNotification } from '../notification'
import { ListArticlesDocument, SchedulableArticleFragmentDoc, UnpublishArticleDocument } from '~/graphql-operations'
import { dayjs } from '~/lib/dayjs'

interface UnpublishArticleInput {
  id: string
}

export function useUnpublishArticle(): (input: UnpublishArticleInput, directlyMutate?: boolean) => Promise<boolean> {
  const { mutate } = useCancelableMutation(UnpublishArticleDocument)
  const { create } = useCancelableNotification()
  const notifications = inject(NOTIFICATION_KEY) as NotificationFactory
  invariant(notifications, 'notifications not provided')

  return async (input: UnpublishArticleInput, directlyMutate?: boolean) => {
    const userResponse = directlyMutate ? Promise.resolve(true) : create({ preset: 'articleUnpublished' })
    await mutate(userResponse, input, {
      optimisticResponse: {
        __typename: 'Mutation',
        unpublishArticle: {
          __typename: 'Article',
          id: input.id,
          published: false,
          published_at: null,
          updated_at: dayjs().toDateTimeString(),
        },
      },
      update: (cache, { data }) => {
        invariant(data?.unpublishArticle, 'no unpublishArticle data')
        const { unpublishArticle } = data
        const query = cache.readQuery({
          query: ListArticlesDocument,
          variables: { unscheduled: true },
        })
        if (!query) {
          return
        }
        const article = cache.readFragment({
          id: cache.identify(unpublishArticle),
          fragment: SchedulableArticleFragmentDoc,
        })
        if (!article) {
          return
        }
        cache.writeQuery({
          query: ListArticlesDocument,
          variables: { unscheduled: true },
          data: {
            articles: [...query.articles, article],
          },
        })
      },
    })

    notifications({
      title: 'Article unpublished',
      iconName: 'draft',
      iconClass: 'text-stone-500',
      content: 'Article taken offline and moved to Drafts.',
    })

    return userResponse
  }
}
