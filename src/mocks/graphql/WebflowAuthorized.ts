import { defineGraphQLMock } from '../define-graphql-mock'
import { WebflowAuthorizedDocument } from '~/graphql-operations'

export default defineGraphQLMock(WebflowAuthorizedDocument, {
  webflowAuthorized: false,
})
