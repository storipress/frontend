import { defineGraphQLMock } from '../define-graphql-mock'
import { ListWebflowItemsDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListWebflowItemsDocument, {
  webflowItems: [
    {
      id: '1',
      name: 'Item 1',
    },
    {
      id: '2',
      name: 'Item 2',
    },
  ],
})
