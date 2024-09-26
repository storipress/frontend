import { defineGraphQLMock } from '../define-graphql-mock'
import { stages } from '../stages'
import { PublishArticleDocument } from '~/graphql-operations'

export default defineGraphQLMock(PublishArticleDocument, (req) => ({
  publishArticle: {
    id: req.variables.id,
    published_at: new Date().toISOString(),
    published: true,
    scheduled: true,
    stage: stages[2],
    updated_at: new Date().toISOString(),
    url: 'https://example.com',
  },
}))
