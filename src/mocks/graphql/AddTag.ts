import { defineGraphQLMock } from '../define-graphql-mock'
import { AddTagToArticleDocument } from '~/graphql-operations'

export default defineGraphQLMock(AddTagToArticleDocument, {
  addTagToArticle: {
    id: '1',
    tags: [{ id: '2' }],
  },
})
