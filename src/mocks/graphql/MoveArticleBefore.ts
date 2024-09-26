import { defineGraphQLMock } from '../define-graphql-mock'
import { MoveArticleBeforeDocument } from '~/graphql-operations'

export default defineGraphQLMock(MoveArticleBeforeDocument, {
  moveArticleBefore: true,
})
