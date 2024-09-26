import { defineGraphQLMock } from '../define-graphql-mock'
import { stages } from '../stages'
import { ArticlePlan, UpdateArticleDocument } from '~/graphql-operations'

export default defineGraphQLMock(UpdateArticleDocument, (req) => ({
  updateArticle: {
    blurb: 'Mock blurb',
    stage: stages[0],
    updated_at: new Date().toISOString(),
    auto_posting: false,
    document: '{}',
    cover: '',
    seo: '{}',
    layout: {
      name: 'foo',
      template: 'foo',
      data: '{}',
      id: '1',
    },
    ...req.variables,
    title: req.variables.title ?? 'Mock title',
    slug: req.variables.slug ?? 'mock-slug',
    featured: req.variables.featured ?? false,
    plan: req.variables.plan ?? ArticlePlan.Free,
    newsletter: req.variables.newsletter ?? false,
    __typename: 'Article' as const,
  },
}))
