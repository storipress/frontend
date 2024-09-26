import { defineGraphQLMock } from '../define-graphql-mock'
import { RemoveAuthorFromArticleDocument } from '~/graphql-operations'

export default defineGraphQLMock(RemoveAuthorFromArticleDocument, {
  removeAuthorFromArticle: {
    id: '1',
    authors: [
      {
        id: '2',
      },
    ],
  },
})
