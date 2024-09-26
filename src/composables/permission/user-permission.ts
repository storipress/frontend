import type { Ref } from 'vue'
import { useDesks } from '../desks'
import { useMe } from '../me'
import { useClientIDMap } from '../client-id-map'

export interface IdentifiableItem {
  id: string
}

export type MaybeIdentifiable = string | IdentifiableItem

interface Me {
  id: string
  role?: string | null
  desks: IdentifiableItem[]
}

export interface UseUserPermissionInput {
  me: Ref<Me | undefined>
  mainDeskMap: Readonly<Ref<Map<string, string>>>
}

const useUserPermissionInput = createGlobalState((): UseUserPermissionInput => {
  return {
    me: useClientIDMap(useMe),
    mainDeskMap: useClientIDMap(useMainDeskMap),
  }
})

/**
 * hook for getting user permission data
 */
export function useUserPermission({ me, mainDeskMap }: UseUserPermissionInput = useUserPermissionInput()) {
  return computed(() => {
    const ownedDeskIds = (me.value?.desks ?? [])
      .map(({ id }) => {
        const mainDesk = mainDeskMap.value.get(id)
        return mainDesk && mainDesk === id ? mainDesk : false
      })
      .filter((x): x is string => typeof x === 'string')
    const ownedDesks = new Set(ownedDeskIds)

    return {
      ready: me.value !== undefined,
      userId: me.value?.id,
      role: me.value?.role || 'contributor',
      ownedDesks,
      mainDeskMap: mainDeskMap.value,
    }
  })
}

export function isAdmin(role: string): boolean {
  return role === 'owner' || role === 'admin'
}

function useMainDeskMap() {
  const { mainDeskMap } = useDesks()
  return mainDeskMap
}
