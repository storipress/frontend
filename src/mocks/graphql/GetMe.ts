import { defineGraphQLMock } from '../define-graphql-mock'
import { GetMeDocument, UserStatus } from '~/graphql-operations'

export default defineGraphQLMock(GetMeDocument, {
  me: {
    id: '152',
    intercom_hash_identity: 'b9697f9443d6845322ba21ec0752b059028a683d0cddeb68e6f6f5a310c4c47d',
    email: 'harvey@storipress.com',
    status: UserStatus.Active,
    verified: false,
    suspended: false,
    first_name: 'Harvey',
    last_name: 'Liu',
    full_name: 'Harvey Liu',
    avatar: 'https://avatars.dicebear.com/api/croodles-neutral/Harvey Liu.svg?b=%23F0F0F0',
    signed_up_source: 'direct',
    location: 'test',
    bio: 'test',
    website: null,
    last_seen_at: null,
    role: 'admin',
    socials: null,
    desks: [
      {
        id: '1',
        __typename: 'Desk',
      },
      {
        id: '2',
        __typename: 'Desk',
      },
      {
        id: '3',
        __typename: 'Desk',
      },
    ],
    __typename: 'User',
  },
})
