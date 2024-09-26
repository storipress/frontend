import { defineGraphQLMock } from '../define-graphql-mock'
import { GetMeMetaDocument } from '~/graphql-operations'

export default defineGraphQLMock(GetMeMetaDocument, {
  __typename: 'Query',
  me: {
    __typename: 'User',
    id: '152',
    meta: JSON.stringify({}),
  },
})
