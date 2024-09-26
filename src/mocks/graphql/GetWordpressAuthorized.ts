import { defineGraphQLMock } from '../define-graphql-mock'
import { GetWordpressAuthorizedDocument } from '~/graphql-operations'

export default defineGraphQLMock(GetWordpressAuthorizedDocument, {
  wordPressAuthorized: true,
})
