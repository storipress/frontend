import type { ListSimpleUsersQuery } from '~/graphql-operations'

export type UserType = ListSimpleUsersQuery['users'][number]
export { UserStatus } from '~/graphql-operations'
