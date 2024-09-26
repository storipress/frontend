import { graphql } from 'msw'
import type { GetAppSubscriptionPlansQuery, GetAppSubscriptionPlansQueryVariables } from '~/graphql-operations'

export default graphql.query<GetAppSubscriptionPlansQuery, GetAppSubscriptionPlansQueryVariables>(
  'GetAppSubscriptionPlans',
  (req, res, ctx) => {
    return res(
      ctx.data({
        appSubscriptionPlans: [
          {
            id: 'publisher-monthly',
            group: 'publisher',
            currency: 'usd',
            price: '2600',
            interval: 'month',
            interval_count: 1,
            usage_type: 'metered',
            __typename: 'AppSubscriptionPlans',
          },
          {
            id: 'publisher-yearly',
            group: 'publisher',
            currency: 'usd',
            price: '25200',
            interval: 'year',
            interval_count: 1,
            usage_type: 'licensed',
            __typename: 'AppSubscriptionPlans',
          },
          {
            id: 'blogger-monthly',
            group: 'blogger',
            currency: 'usd',
            price: '1800',
            interval: 'month',
            interval_count: 1,
            usage_type: 'metered',
            __typename: 'AppSubscriptionPlans',
          },
          {
            id: 'blogger-yearly',
            group: 'blogger',
            currency: 'usd',
            price: '16800',
            interval: 'year',
            interval_count: 1,
            usage_type: 'licensed',
            __typename: 'AppSubscriptionPlans',
          },
        ],
      }),
    )
  },
)
