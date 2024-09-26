import { setActivePinia } from 'pinia'
import { beforeEach, expect, it } from 'vitest'
import { useInvitedProfileCheck } from '../invited-profile'
import { setupTestPinia } from '~/test-helpers'

const reInitialize = vi.fn()
const me = ref({
  id: '',
  first_name: '',
  last_name: '',
  role: '',
  bio: '',
  location: '',
  avatar: '',
})

vi.mock('~/stores/me', () => ({
  useMeStore: () =>
    reactive({
      me,
      reInitialize,
    }),
}))

beforeEach(() => {
  setActivePinia(setupTestPinia())
})

describe('useInvitedProfileCheck', () => {
  it('check owner', async () => {
    me.value = {
      id: 'id',
      first_name: 'First',
      last_name: 'Last',
      role: 'owner',
      bio: '',
      location: '',
      avatar: 'https://assets.stori.press/demo.png',
    }

    const { checkProfileFilled } = useInvitedProfileCheck()

    expect(await checkProfileFilled('clientID')).toBe(false)
  })

  it('check not the owner and have completed profile', async () => {
    me.value = {
      id: 'id',
      first_name: 'First',
      last_name: 'Last',
      role: 'editor',
      bio: 'bio',
      location: 'location',
      avatar: 'https://assets.stori.press/demo.png',
    }

    const { checkProfileFilled } = useInvitedProfileCheck()

    expect(await checkProfileFilled('clientID')).toBe(false)
  })

  it('check not the owner and profile has not been completed yet', async () => {
    me.value = {
      id: 'id',
      first_name: 'First',
      last_name: 'Last',
      role: 'editor',
      bio: 'bio',
      location: '',
      avatar: 'https://assets.stori.press/demo.png',
    }

    const { checkProfileFilled } = useInvitedProfileCheck()

    expect(await checkProfileFilled('clientID')).toBe(true)
  })
})
