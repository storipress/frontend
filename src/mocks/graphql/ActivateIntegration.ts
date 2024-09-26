import { defineGraphQLMock } from '../define-graphql-mock'
import { ActivateIntegrationDocument } from '~/graphql-operations'

export default defineGraphQLMock(ActivateIntegrationDocument, (req) => ({
  activateIntegration: {
    activated_at: '2022-06-20T10:47:06+00:00',
    data: '{"shortname":null}',
    key: req.variables.key,
    order: 6,
    __typename: 'Integration' as const,
  },
}))
