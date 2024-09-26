import { defineGraphQLMock } from '../define-graphql-mock'
import { GetWordpressInfoDocument } from '~/graphql-operations'

export default defineGraphQLMock(GetWordpressInfoDocument, {
  wordPressInfo: {
    version: '1.0.0',
    activated_at: '2022-01-01T00:00:00Z',
    site_name: 'Test Site',
    url: 'https://example.com',
    username: 'Test',
  },
})
