import { defineGraphQLMock } from '../define-graphql-mock'
import { SortArticleByDocument } from '~/graphql-operations'

export default defineGraphQLMock(SortArticleByDocument, {
  sortArticleBy: true,
})
