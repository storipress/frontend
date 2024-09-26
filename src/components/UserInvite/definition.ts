import { RolesTitleMap } from '~/composables/roles'

interface ListDesksQuery {
  id: string
  name: string
  slug: string
  open_access: boolean
}
export interface RolesQuery {
  id: string
  name: string
  title: string
  level: number
}

export interface InviteUserInput {
  email: string
  role: RolesQuery
  deskId: ListDesksQuery[]
}

export const roleInfo = {
  paid: [
    {
      name: RolesTitleMap.owner,
      info: 'Full access to the publication + billing and data',
    },
    {
      name: RolesTitleMap.admin,
      info: 'Can schedule, publish + manage articles in all desks.',
    },
    {
      name: RolesTitleMap.editor,
      info: 'Can schedule, publish + manage articles in their desks.',
    },
  ],
  free: [
    { name: RolesTitleMap.author, info: 'Can schedule and publish their own articles.' },
    {
      name: RolesTitleMap.contributor,
      info: 'Can create articles but cannot schedule or publish them.',
    },
  ],
}

export const planInfo = {
  paid: 'Admins (paid)',
  free: 'Collaborators (free)',
}
