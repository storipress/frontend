import type { MaybeRefOrGetter } from '@vueuse/core'
import type { RouteLocationRaw } from 'vue-router'
import { useRedirection } from '../redirect-action'
import type { PermissionInput } from './helper'
import { useNoPermissionAction } from './helper'

export function useNoPermissionRedirect(
  permission: PermissionInput,
  target: MaybeRefOrGetter<RouteLocationRaw>,
  replace = false,
) {
  const action = useRedirection({ target, replace })
  useNoPermissionAction(permission, action)
}
