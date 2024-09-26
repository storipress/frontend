import { graphql } from 'msw'
import type { RequestAppSetupIntentMutation, RequestAppSetupIntentMutationVariables } from '~/graphql-operations'

export default graphql.mutation<RequestAppSetupIntentMutation, RequestAppSetupIntentMutationVariables>(
  'RequestAppSetupIntent',
  (req, res, ctx) => {
    return res(
      ctx.data({
        requestAppSetupIntent: 'seti_1Ld3n4DQE8vvr0rTPRv5cIz5_secret_MLlJ0X6v7EOWT3Wbm2eglfDjPPFQFlV',
      }),
    )
  },
)
