import { describe, expect, it, vi } from 'vitest'
import { setActivePinia } from 'pinia'
import { captureException } from '@sentry/vue'
import { VIEDEDINGUE, useLicenseCode } from '../license-code'
import { mockResponseError, mockResponseOnce, setupApolloClient, setupTestPinia } from '~/test-helpers'
import ApplyViededingueCode from '~/mocks/graphql/ApplyViededingueCode'

const createNotification = vi.fn()
vi.mock('../notification', () => ({
  useNotification: () => ({ create: createNotification }),
}))
vi.mock('@sentry/vue')

beforeEach(() => {
  setActivePinia(setupTestPinia())
  setupApolloClient()
  createNotification.mockReset()
})

describe('useLicenseCode', () => {
  it('should update license code', async () => {
    mockResponseOnce(ApplyViededingueCode, {
      applyViededingueCode: true,
    })

    const { updateWithErrorNotify } = useLicenseCode(VIEDEDINGUE)
    const result = await updateWithErrorNotify('test-code')

    expect(result).toBe(true)
    expect(createNotification).not.toHaveBeenCalled()
  })

  it('should show notification when update license code failed', async () => {
    mockResponseOnce(ApplyViededingueCode, {
      applyViededingueCode: false,
    })

    const { updateWithErrorNotify } = useLicenseCode(VIEDEDINGUE)
    const result = await updateWithErrorNotify('test-code')

    expect(createNotification).toHaveBeenCalledWith({
      title: 'Invalid license code',
      type: 'warning',
      iconName: 'warning',
    })
    expect(result).toBe(false)
  })

  it('should show notification when update license code error', async () => {
    mockResponseError(ApplyViededingueCode, [
      {
        message: 'Unknown error',
      },
    ])

    const { updateWithErrorNotify } = useLicenseCode(VIEDEDINGUE)
    const result = await updateWithErrorNotify('test-code')

    expect(createNotification).toHaveBeenCalledWith({
      title: 'Invalid license code',
      type: 'warning',
      iconName: 'warning',
    })
    expect(captureException).toBeCalled()
    expect(result).toBe(false)
  })
})
