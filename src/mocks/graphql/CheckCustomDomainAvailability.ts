import { defineGraphQLMock } from '../define-graphql-mock'
import { CheckCustomDomainAvailabilityDocument } from '~/graphql-operations'

export default defineGraphQLMock(CheckCustomDomainAvailabilityDocument, {
  checkCustomDomainAvailability: {
    available: true,
    mail: true,
    redirect: true,
    site: true,
  },
})
