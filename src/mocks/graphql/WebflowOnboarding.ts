import { defineGraphQLMock } from '../define-graphql-mock'
import { WebflowOnboardingDocument } from '~/graphql-operations'

export default defineGraphQLMock(WebflowOnboardingDocument, {
  webflowOnboarding: {
    site: false,
    collection: {
      blog: false,
      author: false,
      desk: false,
      tag: false,
    },
    mapping: {
      blog: false,
      author: false,
      desk: false,
      tag: false,
    },
  },
})
