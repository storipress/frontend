import { graphql } from 'msw'
import type { SubscriptionOverviewQuery, SubscriptionOverviewQueryVariables } from '~/graphql-operations'

export default graphql.query<SubscriptionOverviewQuery, SubscriptionOverviewQueryVariables>(
  'SubscriptionOverview',
  (req, res, ctx) => {
    return res(
      ctx.data({
        subscriptionOverview: {
          current: {
            subscribers: 24,
            paid_subscribers: 4,
            active_subscribers: 24,
            email_sends: 90,
            email_opens: 44,
            email_clicks: 22,
            revenue: '3500',
          },
          previous: {
            subscribers: 19,
            paid_subscribers: 1,
            active_subscribers: 24,
            email_sends: 66,
            email_opens: 33,
            email_clicks: 11,
            revenue: '3000',
          },
        },
      }),
    )
  },
)
