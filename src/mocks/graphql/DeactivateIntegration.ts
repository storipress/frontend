import { defineGraphQLMock } from '../define-graphql-mock'
import { DeactivateIntegrationDocument } from '~/graphql-operations'

export default defineGraphQLMock(DeactivateIntegrationDocument, {
  deactivateIntegration: {
    activated_at: null,
    data: '{"shortname":"xxx"}',
    key: 'disqus',
    __typename: 'Integration' as const,
  },
})
