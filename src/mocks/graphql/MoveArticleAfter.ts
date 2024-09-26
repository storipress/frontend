import { defineGraphQLMock } from '../define-graphql-mock'
import { MoveArticleAfterDocument } from '~/graphql-operations'

export default defineGraphQLMock(MoveArticleAfterDocument, {
  moveArticleAfter: true,
})
