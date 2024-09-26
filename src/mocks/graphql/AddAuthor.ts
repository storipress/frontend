import { defineGraphQLMock } from '../define-graphql-mock'
import { AddAuthorToArticleDocument } from '~/graphql-operations'

export default defineGraphQLMock(AddAuthorToArticleDocument, {
  addAuthorToArticle: {
    id: '1',
    authors: [
      {
        __typename: 'User' as const,
        id: '2',
      },
    ],
  },
})
