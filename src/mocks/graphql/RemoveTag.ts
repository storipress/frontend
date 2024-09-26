import { defineGraphQLMock } from '../define-graphql-mock'
import { RemoveTagFromArticleDocument } from '~/graphql-operations'

export default defineGraphQLMock(RemoveTagFromArticleDocument, {
  removeTagFromArticle: {
    id: '1',
    tags: [{ id: '2' }],
  },
})
