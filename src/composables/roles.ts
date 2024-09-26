import { GetRolesDocument } from '~/graphql-operations'
import type { GetRolesQuery } from '~/graphql-operations'
import type { RoleKeys } from '~/utils/definition'

export enum RolesTitleMap {
  owner = 'Site Owner',
  admin = 'Admin',
  editor = 'Editor',
  author = 'Writer',
  contributor = 'Guest',
}

export function useRoles() {
  const { result } = useQuery(GetRolesDocument)
  const roles = computed(() => {
    const temp = result.value?.roles.map((role) => {
      const CHANGE_ROLES_TITLE = new Set(['contributor', 'author'])

      if (CHANGE_ROLES_TITLE.has(role.name)) {
        return Object.assign({}, role, { title: RolesTitleMap[role.name as RoleKeys] })
      }
      return role
    })
    return temp || ([] as GetRolesQuery['roles'])
  })

  return {
    roles,
  }
}
