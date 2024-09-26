import { defineGraphQLMock } from '../define-graphql-mock'
import { ListWebflowCollectionsDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListWebflowCollectionsDocument, {
  webflowCollections: [
    { id: '1', displayName: 'collection 1' },
    { id: '2', displayName: 'collection 2' },
  ],
})
