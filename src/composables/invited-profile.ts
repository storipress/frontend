import { isUserInfoComplete } from './tutorials'
import { useAuthStore } from '~/stores/auth'
import { useMeStore } from '~/stores/me'

/**
 * when user is invited, we will use this function to check should user go to profile fill up page
 */
export function useInvitedProfileCheck() {
  const store = useAuthStore()
  const meStore = useMeStore()
  const me = computed(() => meStore.me)
  const user = computed(() => ({
    role: me.value?.role ?? '',
    avatar: me.value?.avatar ?? '',
    first_name: me.value?.first_name ?? '',
    last_name: me.value?.last_name ?? '',
    location: me.value?.location ?? '',
    bio: me.value?.bio ?? '',
  }))

  return {
    async checkProfileFilled(clientID: string) {
      store.clientID = clientID
      meStore.reInitialize()
      await until(me).not.toBeUndefined()
      return user.value.role !== 'owner' && !isUserInfoComplete(user.value)
    },
  }
}
