import { graphql } from 'msw'
import { generateRevenue, generateSubscribers } from '@storipress/core-component'
import type { SubscriptionGraphsQuery, SubscriptionGraphsQueryVariables } from '~/graphql-operations'

export default graphql.query<SubscriptionGraphsQuery, SubscriptionGraphsQueryVariables>(
  'SubscriptionGraphs',
  (req, res, ctx) => {
    return res(
      ctx.data({
        subscriptionGraphs: {
          subscribers: generateSubscribers(100, '2020-08-01'),
          revenue: generateRevenue(100, '2020-08-01'),
        },
      }),
    )
  },
)
