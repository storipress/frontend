import { defineGraphQLMock } from '../define-graphql-mock'
import { GetLayoutDocument } from '~/graphql-operations'

export default defineGraphQLMock(GetLayoutDocument, {
  layouts: [],
})
