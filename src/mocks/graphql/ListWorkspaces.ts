import { defineGraphQLMock } from '../define-graphql-mock'
import { ListWorkspacesDocument, UserStatus } from '~/graphql-operations'

export default defineGraphQLMock(ListWorkspacesDocument, {
  workspaces: [
    {
      id: 'D6RX98VXN',
      name: "Joe's Blog",
      workspace: 'joesblog',
      custom_domain: null,
      customer_site_domain: 'www.example.com',
      role: 'owner',
      status: UserStatus.Active,
      __typename: 'Workspace',
    },
    {
      id: 'D6N4P7W2R',
      name: 'Test1',
      workspace: 'test1-85dl',
      custom_domain: null,
      customer_site_domain: 'www.example.com',
      role: 'admin',
      status: UserStatus.Active,
      __typename: 'Workspace',
    },
    {
      id: 'DGN2GMGGN',
      name: 'test-3',
      workspace: 'test-3-ught',
      custom_domain: null,
      customer_site_domain: 'www.example.com',
      role: 'admin',
      status: UserStatus.Active,
      __typename: 'Workspace',
    },
  ],
})
