import { graphql } from 'msw'
import type { CreateAppSubscriptionMutation, CreateAppSubscriptionMutationVariables } from '~/graphql-operations'

export default graphql.mutation<CreateAppSubscriptionMutation, CreateAppSubscriptionMutationVariables>(
  'CreateAppSubscription',
  (req, res, ctx) => {
    return res(
      ctx.data({
        createAppSubscription: true,
      }),
    )
  },
)
