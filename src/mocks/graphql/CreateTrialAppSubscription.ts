import { defineGraphQLMock } from '../define-graphql-mock'
import { CreateTrialAppSubscriptionDocument } from '~/graphql-operations'

export default defineGraphQLMock(CreateTrialAppSubscriptionDocument, () => ({ createTrialAppSubscription: true }))
