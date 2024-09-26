import { expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useMe } from '../me'

const apolloClient = {
  query: vi.fn(),
}
const apolloClientID = ref('clientID')
const authClientID = ref('clientID')

vi.mock('@sentry/vue', () => ({
  captureException: vi.fn(),
}))

vi.mock('~/lib/apollo', () => ({
  useApolloClient: () => ({
    client: apolloClient,
    clientID: apolloClientID.value,
  }),
}))

vi.mock('~/stores/auth', () => ({
  useAuthStore: () =>
    reactive({
      clientID: authClientID,
    }),
}))
vi.mock('~/components/ConfirmModalProvider/useConfirmModal', () => ({
  useConfirmFunction: () => [vi.fn(() => Promise.resolve(false))],
  useConfirmModal: () => ({ modalList: [] }),
}))

beforeEach(() => {
  vi.resetAllMocks()
})

describe('useMe', () => {
  it('should handle successful query', async () => {
    useMe()
    await nextTick()

    expect(apolloClient.query).toHaveBeenCalled()
  })

  it('should handle `default` client id', async () => {
    apolloClientID.value = 'default'

    useMe()
    await nextTick()

    expect(apolloClient.query).not.toBeCalled()
  })
})
