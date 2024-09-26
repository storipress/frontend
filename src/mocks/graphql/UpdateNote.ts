import { defineGraphQLMock } from '../define-graphql-mock'
import { UpdateNoteDocument } from '~/graphql-operations'

export default defineGraphQLMock(UpdateNoteDocument, (req) => ({
  updateNote: {
    __typename: 'ArticleThreadNote' as const,
    id: req.variables.input.id,
    content: req.variables.input.content,
    thread: {
      id: 'id',
    },
  },
}))
