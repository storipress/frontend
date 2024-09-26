import { defineGraphQLMock } from '../define-graphql-mock'
import { UnpublishArticleDocument } from '~/graphql-operations'

export default defineGraphQLMock(UnpublishArticleDocument, (req) => {
  return {
    unpublishArticle: {
      id: req.variables.id,
      published_at: null,
      published: false,
      url: 'https://example.com',
      updated_at: new Date().toISOString(),
    },
  }
})
