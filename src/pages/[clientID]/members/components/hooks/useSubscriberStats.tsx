import ActivityChips from '../ActivityChips.vue'
import { dayjs } from '~/lib/dayjs'
import { SubscriberStatsDocument } from '~/graphql-operations'
import { useFeatureFlag } from '~/lib/feature-flag'
import { addDecimal } from '~/utils'

enum SubscriberType {
  free = 'Free',
  subscribed = 'Paid',
  unsubscribed = 'Unsubscribed',
}
export function getSubscriberType(subscriptionType?: keyof typeof SubscriberType) {
  if (!subscriptionType) return ''
  return SubscriberType[subscriptionType]
}

export default function (id: string) {
  const { result, loading, refetch } = useQuery(SubscriberStatsDocument, { id })
  const enableMembersComment = useFeatureFlag('members-comment-count')

  const statsList = computed<
    {
      title: string
      value?: string | number | boolean
      component?: JSX.Element
    }[]
  >(() => {
    const comments = enableMembersComment.value
      ? [
          { title: 'Comments (all time)', value: result.value?.subscriber?.comments_total },
          { title: 'Comments (last 7 days)', value: result.value?.subscriber?.comments_last_7 },
          { title: 'Comments (last 30 days)', value: result.value?.subscriber?.comments_last_30 },
        ]
      : []
    return [
      { title: 'Name', value: result.value?.subscriber?.full_name },
      { title: 'Email', value: result.value?.subscriber?.email },
      { title: 'Subscription type', value: getSubscriberType(result.value?.subscriber?.subscription_type) },
      {
        title: 'Activity',
        value: result.value?.subscriber?.activity,
        component: (
          <ActivityChips
            bounced={result.value?.subscriber?.bounced}
            newsletter={result.value?.subscriber?.newsletter}
            activity={result.value?.subscriber?.activity}
          />
        ),
      },
      {
        title: 'Subscription date',
        value: result.value?.subscriber?.subscribed_at
          ? dayjs(result.value?.subscriber?.subscribed_at).format('MMMM Do, YYYY')
          : '',
      },
      { title: 'Revenue', value: addDecimal(result.value?.subscriber?.revenue) },
      ...comments,
      { title: 'Shares (all time)', value: result.value?.subscriber?.shares_total },
      { title: 'Shares (last 7 days)', value: result.value?.subscriber?.shares_last_7 },
      { title: 'Shares (last 30 days)', value: result.value?.subscriber?.shares_last_30 },
      { title: 'Email opens (all time)', value: result.value?.subscriber?.email_opens_total },
      { title: 'Email opens (last 7 days)', value: result.value?.subscriber?.email_opens_last_7 },
      { title: 'Email opens (last 30 days)', value: result.value?.subscriber?.email_opens_last_30 },
      { title: 'Unique emails seen (all time)', value: result.value?.subscriber?.unique_email_opens_total },
      { title: 'Unique emails seen (last 7 days)', value: result.value?.subscriber?.unique_email_opens_last_7 },
      { title: 'Unique emails seen (last 30 days)', value: result.value?.subscriber?.unique_email_opens_last_30 },
      { title: 'Web post views (all-time)', value: result.value?.subscriber?.article_views_total },
      { title: 'Web post views (last 7 days)', value: result.value?.subscriber?.article_views_last_7 },
      { title: 'Web post views (last 30 days)', value: result.value?.subscriber?.article_views_last_30 },
      { title: 'Unique web posts seen (all-time)', value: result.value?.subscriber?.unique_article_views_total },
      { title: 'Unique web posts seen (last 7 days)', value: result.value?.subscriber?.unique_article_views_last_7 },
      { title: 'Unique web posts seen (last 30 days)', value: result.value?.subscriber?.unique_article_views_last_30 },
      // { title: 'Subscriptions gifted', value: result.value?.subscriber?. },
      { title: 'Expires at', value: result.value?.subscriber?.expire_on },
      { title: 'Subscription source (free)', value: result.value?.subscriber?.signed_up_source },
      { title: 'Subscription source (paid)', value: result.value?.subscriber?.paid_up_source },
      { title: 'Days active (last 30 days)', value: result.value?.subscriber?.active_days_last_30 },
      { title: 'First payment at', value: result.value?.subscriber?.first_paid_at },
      { title: 'Paid upgrade date', value: result.value?.subscriber?.renew_on },
      { title: 'Cancel date', value: result.value?.subscriber?.canceled_at },
    ]
  })

  return {
    result,
    loading,
    statsList,
    data: computed(() => result.value?.subscriber),
    refetch(id: string) {
      if (!id) return Promise.reject(new Error('id is required'))
      return refetch({ id })
    },
  }
}
