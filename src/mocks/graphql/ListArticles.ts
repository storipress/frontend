import { defineGraphQLMock } from '../define-graphql-mock'
import { ListArticlesDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListArticlesDocument, {
  articles: [],
})
