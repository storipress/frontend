import { defineGraphQLMock } from '../define-graphql-mock'
import { ListInvitationsDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListInvitationsDocument, {
  invitations: [
    {
      desks: [],
      email: 'ariel+01@storipress.com',
      id: '1',
      role: 'admin',
      __typename: 'Invitation',
    },
  ],
})
