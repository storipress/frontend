import { defineGraphQLMock } from '../define-graphql-mock'
import { HubSpotInfoDocument } from '~/graphql-operations'

export default defineGraphQLMock(HubSpotInfoDocument, {
  hubSpotInfo: {
    activated_at: '2020-01-01T00:00:00Z',
  },
})
