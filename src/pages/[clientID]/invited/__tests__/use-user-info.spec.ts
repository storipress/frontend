import { describe, expect, it, vi } from 'vitest'
import { setActivePinia } from 'pinia'
import { useUserInfo } from '../use-user-info'
import { setupTestPinia } from '~/test-helpers'

const prepareForUsing = vi.fn()
const pushRoute = vi.fn()
const me = ref({
  id: 'id',
  first_name: 'First',
  last_name: 'Last',
  role: 'editor',
  bio: '',
  location: '',
  avatar: 'https://assets.stori.press/demo.png',
})
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushRoute,
    replace: pushRoute,
  }),
  useRoute: () => ({}),
}))

vi.mock('~/stores/me', () => ({
  useMeStore: () =>
    reactive({
      me,
      prepareForUsing,
    }),
}))

beforeEach(() => {
  setActivePinia(setupTestPinia())
  pushRoute.mockClear()
  me.value = {
    id: 'id',
    first_name: 'First',
    last_name: 'Last',
    role: 'editor',
    bio: '',
    location: '',
    avatar: 'https://assets.stori.press/demo.png',
  }
})

describe('useUserInfo', () => {
  it('can load user info via checkUserInfo', async () => {
    const { checkUserInfo, userInfo } = useUserInfo()
    expect(userInfo).toEqual({
      id: '',
      firstName: '',
      lastName: '',
      location: '',
      bio: '',
      avatar: '',
    })

    await checkUserInfo()

    expect(pushRoute).not.toBeCalled()
    expect(prepareForUsing).toBeCalled()
    expect(userInfo).toEqual({
      id: 'id',
      firstName: 'First',
      lastName: 'Last',
      avatar: 'https://assets.stori.press/demo.png',
      bio: '',
      location: '',
    })
  })

  it('will redirect if user info complete', async () => {
    me.value = {
      ...me.value,
      bio: 'bio',
      location: 'location',
    }
    const { checkUserInfo } = useUserInfo()

    await checkUserInfo()

    expect(pushRoute).toBeCalledWith({
      name: 'workspaces',
    })
  })

  it('will redirect if user is owner', async () => {
    me.value = {
      ...me.value,
      role: 'owner',
    }
    const { checkUserInfo } = useUserInfo()

    await checkUserInfo()

    expect(pushRoute).toBeCalledWith({
      name: 'workspaces',
    })
  })
})
