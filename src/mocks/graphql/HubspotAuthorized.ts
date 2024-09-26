import { defineGraphQLMock } from '../define-graphql-mock'
import { HubSpotAuthorizedDocument } from '~/graphql-operations'

export default defineGraphQLMock(HubSpotAuthorizedDocument, {
  hubSpotAuthorized: true,
})
