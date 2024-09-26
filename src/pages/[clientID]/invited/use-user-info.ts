import invariant from 'tiny-invariant'
import type { UserInfo } from './definitions'
import { useTutorials } from '~/composables'
import { useMeStore } from '~/stores/me'

export function useUserInfo() {
  const router = useRouter()
  const meStore = useMeStore()
  const { incompleteAvatar, incompleteUserInfo } = useTutorials()

  const me = computed(() => meStore.me)
  const userInfo = reactive<UserInfo>({ id: '', firstName: '', lastName: '', location: '', bio: '', avatar: '' })

  async function checkUserInfo() {
    await meStore.prepareForUsing()
    await until(computed(() => me.value?.role)).toBeTruthy()
    invariant(me.value, 'me info not init')
    if (me.value.role === 'owner' || !incompleteUserInfo.value) {
      router.replace({ name: 'workspaces' })
    } else {
      Object.assign(userInfo, {
        id: me.value.id,
        firstName: me.value.first_name ?? '',
        lastName: me.value.last_name ?? '',
        location: me.value.location ?? '',
        bio: me.value.bio ?? '',
        avatar: me.value.avatar,
      })
    }
  }

  return { userInfo, incompleteAvatar, incompleteUserInfo, checkUserInfo, meStore }
}
