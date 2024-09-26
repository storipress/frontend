import { defineGraphQLMock } from '../define-graphql-mock'
import { UpdateIntegrationDocument } from '~/graphql-operations'

export default defineGraphQLMock(UpdateIntegrationDocument, (req) => ({
  updateIntegration: {
    activated_at: '2022-06-20T10:47:06+00:00',
    data: req.variables.input.data,
    key: req.variables.input.key,
    order: 6,
    __typename: 'Integration' as const,
  },
}))
