import { defineGraphQLMock } from '../define-graphql-mock'
import { CreateStageDocument } from '~/graphql-operations'

export default defineGraphQLMock(CreateStageDocument, {
  createStage: {
    id: '143',
    name: 'test',
    color: '#0f766e',
    icon: 'preview',
    order: 2,
    ready: false,
    default: false,
    __typename: 'Stage',
  },
})
