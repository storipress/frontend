import type { MaybeRef } from '@vueuse/core'
import type { ApolloCache, NormalizedCacheObject } from '@apollo/client/core'
import type { NotificationFactory } from '@storipress/core-component'
import { NOTIFICATION_KEY } from '@storipress/core-component'
import invariant from 'tiny-invariant'
import { useCancelableNotification } from '../notification'
import type { SchedulableArticleFragment } from '~/graphql-operations'
import { ListArticlesDocument, PublishArticleDocument, SchedulableArticleFragmentDoc } from '~/graphql-operations'
import { dayjs } from '~/lib/dayjs'
import { useStages } from '~/composables'

interface ScheduleArticleInput {
  id: string
  time: dayjs.Dayjs | Date
  now?: false
}

interface PublishNowArticleInput {
  id: string
  time?: dayjs.Dayjs | Date
  now: true
}

type PublishArticleInput = ScheduleArticleInput | PublishNowArticleInput

export function usePublishArticle(
  rangeFilter?: MaybeRef<{ from: string; to: string } | undefined>,
): (input: PublishArticleInput, directlyMutate?: boolean, source?: string) => Promise<boolean> {
  const stages = useStages()
  const { mutate } = useCancelableMutation(PublishArticleDocument)
  const { create } = useCancelableNotification()
  const notifications = inject(NOTIFICATION_KEY) as NotificationFactory
  invariant(notifications, 'notifications not provided')

  return async (input: PublishArticleInput, directlyMutate?: boolean, source = 'scheduler') => {
    const { id, time, now } = input
    const currentTime = dayjs()
    const variables = { id, time: time ? dayjs(time).toDateTimeString() : currentTime.toDateTimeString(), now }
    const isPublished = currentTime.isAfter(time)
    const userResponse = directlyMutate
      ? Promise.resolve(true)
      : create({ preset: now || isPublished ? 'articlePublished' : 'articleScheduled' })
    const result = await mutate(userResponse, variables, {
      optimisticResponse: {
        __typename: 'Mutation',
        publishArticle: {
          __typename: 'Article',
          id,
          published: isPublished,
          url: '',
          published_at: time ? dayjs(time).toDateTimeString() : currentTime.toDateTimeString(),
          // Because this is publish article API, the article should be either publish immediately or schedule
          scheduled: !isPublished,
          updated_at: currentTime.toDateTimeString(),
          ...(now && { stage: stages.value.find((stage) => stage.name === 'Reviewed') }),
        },
      },
      refetchQueries: [{ query: ListArticlesDocument, variables: { range: unref(rangeFilter) } }],
      update(cache, { data }) {
        invariant(data?.publishArticle, 'no publishArticle data')
        const { publishArticle } = data
        const articleId = cache.identify(publishArticle)
        const article = getNewArticle(cache, articleId, publishArticle)
        if (article) {
          cache.writeFragment({ id: articleId, data: article, fragment: SchedulableArticleFragmentDoc })

          // update calendar articles
          const range = unref(rangeFilter)
          if (range) {
            cache.updateQuery(
              {
                query: ListArticlesDocument,
                variables: {
                  range,
                },
              },
              (data) => {
                if (!data) {
                  return
                }

                return {
                  articles: [...data.articles.filter((a) => a.id !== article.id), article],
                }
              },
            )
          }
        }
        cache.updateQuery(
          {
            query: ListArticlesDocument,
            variables: { unscheduled: true },
          },
          (data) => {
            if (!data) {
              return null
            }
            return {
              ...data,
              articles: data.articles.filter((article) => article.id !== publishArticle.id),
            }
          },
        )
      },
    })

    const stage = result?.data?.publishArticle.stage.name
    if (stage === 'Reviewed' && (now || isPublished)) {
      notifications({
        title: 'Changes updated',
        type: 'primary',
        iconName: 'refresh',
        content: 'Site build triggered. Article will be live in 3-5 minutes.',
      })
    } else {
      notifications({
        title: 'Article scheduled',
        iconName: 'schedule',
        content: 'A scheduled article will only publish if it is marked as reviewed (Green).',
      })
    }

    sendTrackUnchecked('tenant_article_scheduled', {
      source,
      article_id: id,
      now,
    })

    return userResponse
  }
}

function getNewArticle(
  cache: ApolloCache<NormalizedCacheObject>,
  id: string | undefined,
  newData: { published: boolean; published_at?: string; scheduled: boolean },
): SchedulableArticleFragment | undefined {
  const oldArticle = cache.readFragment({
    id,
    fragment: SchedulableArticleFragmentDoc,
  })

  if (!oldArticle) {
    return
  }

  return {
    ...oldArticle,
    ...newData,
  }
}
