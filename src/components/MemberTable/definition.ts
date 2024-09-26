import type { ListDesksQuery, UserStatus } from '~/graphql-operations'
import type { RoleKeys } from '~/utils/definition'

export interface MemberDataInterface {
  id: string
  name: string
  full_name: string
  avatar: string
  email: string
  status: UserStatus
  role: RoleKeys
  desks: { id: string; name: string; desk?: ListDesksQuery }[]
  suspended: boolean
}

interface DeskInput {
  deskId: string
  userId: string
}

export interface EditUserDesksInput {
  result: MemberDataInterface['desks']
  input: DeskInput
}
