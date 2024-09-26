import type { MaybeRefOrGetter } from '@vueuse/core'
import { toRef } from '@vueuse/core'
import { useConditionAction } from '../redirect-action'
import type { UsePublicationPermissionReturn } from './publication'
import { usePublicationPermission } from './publication'

export type PermissionInput =
  | keyof Omit<UsePublicationPermissionReturn, 'canDragItemIntoDesk' | 'canAccessDesk' | 'canUpdateDesk' | 'ready'>
  | MaybeRefOrGetter<boolean>

export function useNoPermissionAction(permission: PermissionInput, action: () => void) {
  const permissions = usePublicationPermission()
  const _permission = normalizePermission(permissions, permission)

  useConditionAction({
    trigger: computed(() => !_permission.value),
    enabled: computed(() => permissions.ready.value),
    action,
  })
}

export function normalizePermission(
  permissions: UsePublicationPermissionReturn,
  permission: PermissionInput,
): Ref<boolean> {
  if (typeof permission === 'string') {
    return permissions[permission]
  }
  return toRef(permission)
}
