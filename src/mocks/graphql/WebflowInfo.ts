import { defineGraphQLMock } from '../define-graphql-mock'
import { WebflowInfoDocument } from '~/graphql-operations'

export default defineGraphQLMock(WebflowInfoDocument, {
  webflowInfo: {
    site_id: 'site_id',
    domain: 'https://example.com',
  },
})
