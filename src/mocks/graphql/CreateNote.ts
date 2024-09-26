import { defineGraphQLMock } from '../define-graphql-mock'
import { CreateNoteDocument } from '~/graphql-operations'

export default defineGraphQLMock(CreateNoteDocument, (req) => ({
  createNote: {
    __typename: 'ArticleThreadNote' as const,
    id: Math.random().toString(16).slice(2),
    content: req.variables.input.content,
    created_at: new Date().toISOString(),
    user: {
      __typename: 'User' as const,
      id: '1',
      full_name: 'Grace Harvey',
      avatar: 'https://avatars.dicebear.com/api/initials/Grace Harvey.svg',
    },
    thread: {
      __typename: 'ArticleThread' as const,
      id: req.variables.input.thread_id,
    },
  },
}))
