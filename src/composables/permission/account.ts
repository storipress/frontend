import type { Ref } from 'vue'
import { useClientIDMap } from '../client-id-map'
import { GetMeAccountDocument } from '~/graphql-operations'
import { useMe as useMeComposable } from '~/composables/me'

export function useMe() {
  return useMeComposable(GetMeAccountDocument)
}

export interface UsePublicationPermissionReturn {
  ready: Ref<boolean>
  /** current user can update billing detail */
  canUseBilling: Ref<boolean>
}

const useUserPermissionInput = createGlobalState(() => {
  return {
    me: useClientIDMap(useMe),
  }
})

export function useUserPermission({ me } = useUserPermissionInput()) {
  return computed(() => {
    return {
      ready: me.value !== undefined,
      userId: me.value?.id,
      role: me.value?.role || 'contributor',
    }
  })
}

export function useAccountPermission(): UsePublicationPermissionReturn {
  const userPermission = useUserPermission()
  const route = useRoute()

  const withoutPublication = route.params.clientID === '_'

  const userIsOwner = computed(() => {
    if (withoutPublication) return true

    const { role, ready } = userPermission.value
    return ready && role === 'owner'
  })

  return {
    ready: computed(() => userPermission.value.ready),
    canUseBilling: userIsOwner,
  }
}
