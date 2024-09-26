import invariant from 'tiny-invariant'
import { stages } from '../stages'
import { defineGraphQLMock } from '../define-graphql-mock'
import { ArticlePlan, ChangeArticleStageDocument } from '~/graphql-operations'

export default defineGraphQLMock(ChangeArticleStageDocument, (req) => {
  const stage = stages.find((s) => s.id === req.variables.input.stage_id)
  invariant(stage, 'no stage')

  return {
    changeArticleStage: {
      id: req.variables.input.id,
      title: 'title',
      blurb: '',
      seo: JSON.stringify({}),
      cover: JSON.stringify({ url: 'url' }),
      updated_at: '1999-12-31T00:00:00.000Z',
      slug: 'slug',
      plan: ArticlePlan.Free,
      featured: false,
      stage,
    },
  }
})
