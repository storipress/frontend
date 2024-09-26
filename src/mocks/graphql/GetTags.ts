import { defineGraphQLMock } from '../define-graphql-mock'
import { GetTagsDocument } from '~/graphql-operations'

export default defineGraphQLMock(GetTagsDocument, {
  tags: [
    { id: '0', name: 'World' },
    { id: '1', name: 'Business' },
    { id: '2', name: 'Opinion' },
    { id: '3', name: 'Tech' },
    { id: '4', name: 'Science' },
    { id: '5', name: 'Health' },
    { id: '6', name: 'Sports' },
    { id: '7', name: 'Arts' },
    { id: '8', name: 'Books' },
    { id: '9', name: 'Style' },
    { id: '10', name: 'Food' },
    { id: '11', name: 'Video' },
  ],
})
