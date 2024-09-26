import { defineGraphQLMock } from '../define-graphql-mock'
import { dayjs } from '~/lib/dayjs'
import { ListThreadsDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListThreadsDocument, (req) => ({
  article: {
    id: req.variables.id,
    threads: [
      {
        __typename: 'ArticleThread' as const,
        id: '1',
        position: JSON.stringify({ from: 0, to: 1 }),
        resolved_at: null,
        notes: [
          {
            __typename: 'ArticleThreadNote' as const,
            id: '1',
            content: 'I think this bit needs changing, what do you think?',
            user: {
              __typename: 'User' as const,
              id: '1',
              full_name: 'Grace Harvey',
              avatar: 'https://avatars.dicebear.com/api/initials/Grace Harvey.svg',
            },
            thread: {
              __typename: 'ArticleThread' as const,
              id: '1',
            },
            created_at: dayjs('2022-01-01T00:00:00.000Z').toISOString(),
          },
          {
            __typename: 'ArticleThreadNote' as const,
            id: '2',
            content: 'Fixed!',
            user: {
              __typename: 'User' as const,
              id: '2',
              full_name: 'Alex Gore',
              avatar: 'https://avatars.dicebear.com/api/initials/Alex Gore.svg',
            },
            thread: {
              __typename: 'ArticleThread' as const,
              id: '1',
            },
            created_at: dayjs('2022-01-01T00:00:00.000Z').toISOString(),
          },
        ],
      },
    ],
  },
}))
