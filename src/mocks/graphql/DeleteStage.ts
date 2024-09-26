import { defineGraphQLMock } from '../define-graphql-mock'
import { DeleteStageDocument } from '~/graphql-operations'

export default defineGraphQLMock(DeleteStageDocument, {
  deleteStage: {
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
