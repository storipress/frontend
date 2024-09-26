import { setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { useShowAPIError } from '../show-api-error'
import { setupTestPinia } from '~/test-helpers'
import { useKnownAPIErrorsStore } from '~/stores/known-api-errors'

const createNotification = vi.fn()

const scope = {
  setTags: vi.fn(),
  setContext: vi.fn(),
  setFingerprint: vi.fn(),
}

vi.mock('@sentry/vue', () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn((_error, configScope) => {
    configScope(scope)
  }),
}))

vi.mock('../notification', () => ({
  useNotification: () => ({
    create: createNotification,
  }),
}))

beforeEach(() => {
  setActivePinia(setupTestPinia())
})

describe('useShowAPIError', () => {
  it('should handle API errors', async () => {
    const store = useKnownAPIErrorsStore()

    useShowAPIError()

    store.errors = [
      {
        code: 42,
        message: 'mockMessage',
        path: ['mockPath'],
        operationName: 'mockOperationName',
      },
    ]

    await flushPromises()

    expect(sendTrack).toHaveBeenCalledWith('api_error_displayed', {
      code: 42,
      message: 'mockMessage',
      path: ['mockPath'],
      operationName: 'mockOperationName',
    })
    expect(scope.setTags).toHaveBeenCalledWith({
      knownError: true,
      knownErrorCode: 42,
    })
    expect(scope.setContext).toHaveBeenCalledWith('errorInfo', {
      code: 42,
      path: ['mockPath'],
      operationName: 'mockOperationName',
    })
    expect(scope.setFingerprint).toHaveBeenCalledWith(['mockOperationName', 'mockPath', '42'])

    expect(createNotification).toHaveBeenCalledWith({
      type: 'warning',
      iconName: 'warning',
      title: 'mockMessage',
    })

    expect(store.clear).toBeCalled()
  })
})
