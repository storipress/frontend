import { defineGraphQLMock } from '../define-graphql-mock'
import { ListPublicationsDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListPublicationsDocument, {
  publications: [
    {
      id: 'D6RX98VXN',
      name: "Joe's Blog",
      workspace: 'joesblog',
      __typename: 'Publication',
    },
    {
      id: 'D6N4P7W2R',
      name: 'Test1',
      workspace: 'test1-85dl',
      __typename: 'Publication',
    },
    {
      id: 'DGN2GMGGN',
      name: 'test-3',
      workspace: 'test-3-ught',
      __typename: 'Publication',
    },
  ],
})
