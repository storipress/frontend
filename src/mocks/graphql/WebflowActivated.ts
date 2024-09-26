import { defineGraphQLMock } from '../define-graphql-mock'
import { WebflowActivatedDocument } from '~/graphql-operations'

export default defineGraphQLMock(WebflowActivatedDocument, {
  webflowInfo: {
    activated_at: '2022-01-01T00:00:00Z',
  },
})
