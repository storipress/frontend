import { Array } from 'effect'
import { defineGraphQLMock } from '../define-graphql-mock'
import { SubscribersDocument, SubscriptionType } from '~/graphql-operations'
import type { SubscribersQuery } from '~/graphql-operations'

function getSubscriptionType(index: number): SubscriptionType {
  switch (index % 3) {
    case 0:
      return SubscriptionType.Subscribed
    case 1:
      return SubscriptionType.Free
    case 2:
      return SubscriptionType.Unsubscribed
    default:
      return SubscriptionType.Free
  }
}

type Subscriber = SubscribersQuery['subscribers']['data'][number]

const data = Array.makeBy(
  299,
  (index: number): Subscriber => ({
    id: String(index + 1),
    email: `test_${index + 1}@example.com`,
    bounced: false,
    avatar: '',
    newsletter: true,
    subscription_type: getSubscriptionType(index),
    subscribed_at: 'December 4th, 2021',
    created_at: 'December 4th, 2021',
    revenue: '2400',
    activity: Math.floor(Math.random() * 100),
    subscription: null,
  }),
)

export default defineGraphQLMock(SubscribersDocument, (req) => {
  const first = req.variables.first ?? 20
  const page = req.variables.page ?? 1
  const resData = req.variables.first ? data.slice(first * (page - 1), first * page) : data

  return {
    subscribers: {
      paginatorInfo: {
        count: resData.length,
        currentPage: page,
        total: data.length,
      },
      data: resData,
    },
  }
})
