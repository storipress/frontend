import { defineGraphQLMock } from '../define-graphql-mock'
import { ChangeAccountEmailDocument } from '~/graphql-operations'

export default defineGraphQLMock(ChangeAccountEmailDocument, (req) => ({
  changeAccountEmail: {
    id: '152',
    email: req.variables.input.email,
    __typename: 'User' as const,
  },
}))
