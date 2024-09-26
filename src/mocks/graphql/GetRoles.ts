import { defineGraphQLMock } from '../define-graphql-mock'
import { GetRolesDocument } from '~/graphql-operations'

export default defineGraphQLMock(GetRolesDocument, {
  roles: [
    { id: '1', name: 'owner', title: 'Site Owner', level: 4294967295, __typename: 'Role' },
    { id: '2', name: 'admin', title: 'Administrator', level: 4096, __typename: 'Role' },
    { id: '3', name: 'editor', title: 'Editor', level: 1024, __typename: 'Role' },
    { id: '4', name: 'author', title: 'Author', level: 256, __typename: 'Role' },
    { id: '5', name: 'contributor', title: 'Contributor', level: 64, __typename: 'Role' },
  ],
})
