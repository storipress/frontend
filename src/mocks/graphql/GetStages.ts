import { stages } from '../stages'
import { defineGraphQLMock } from '../define-graphql-mock'
import { GetStagesDocument } from '~/graphql-operations'

export default defineGraphQLMock(GetStagesDocument, () => ({
  stages,
}))
