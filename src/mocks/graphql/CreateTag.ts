import { defineGraphQLMock } from '../define-graphql-mock'
import { CreateTagDocument } from '~/graphql-operations'

export default defineGraphQLMock(CreateTagDocument, {
  createTag: {
    id: '1',
    name: 'test',
    description: 'test',
  },
})
