import { expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import type { Stripe, StripeElements } from '@stripe/stripe-js'
import { useTrialCheckout } from '../use-trial-checkout'
import { mockResponseOnce, setupApolloClient, setupTestPinia } from '~/test-helpers'
import CreateTrialAppSubscriptionMock from '~/mocks/graphql/CreateTrialAppSubscription'

const createNotification = vi.fn()

beforeEach(() => {
  setActivePinia(setupTestPinia())
  setupApolloClient()
  vi.useFakeTimers()
  createNotification.mockClear()

  return () => {
    vi.useRealTimers()
  }
})

vi.mock('~/composables', () => ({
  useNotification: () => ({
    create: createNotification,
  }),
}))

it('subscribeTrial will return true if success', async () => {
  const { subscribeTrial, loadingCreateTrial } = useTrialCheckout({
    elements: ref(undefined),
    stripe: ref(undefined),
    fullName: ref(''),
  })
  expect(loadingCreateTrial.value).toBe(false)
  const subscribeResult = subscribeTrial()
  expect(loadingCreateTrial.value).toBe(true)
  await flushPromises()
  vi.runAllTimers()
  await expect(subscribeResult).resolves.toBe(true)
  expect(createNotification).not.toBeCalled()
})

it('subscribeTrial will return false if subscribe fail', async () => {
  mockResponseOnce(CreateTrialAppSubscriptionMock, { createTrialAppSubscription: false })
  const { subscribeTrial, loadingCreateTrial } = useTrialCheckout({
    elements: ref(undefined),
    stripe: ref(undefined),
    fullName: ref(''),
  })
  expect(loadingCreateTrial.value).toBe(false)
  const subscribeResult = subscribeTrial()
  expect(loadingCreateTrial.value).toBe(true)
  await flushPromises()
  vi.runAllTimers()
  await expect(subscribeResult).resolves.toBe(false)
  expect(createNotification).toHaveBeenCalledTimes(1)
})

it('confirmPaymentMethod should return token if confirm success', async () => {
  const mockStripe = {
    confirmSetup: vi.fn().mockResolvedValue({
      error: null,
      setupIntent: {
        status: 'succeeded',
        payment_method: 'token',
      },
    }),
  }
  const { confirmPaymentMethod } = useTrialCheckout({
    elements: ref({} as StripeElements),
    stripe: ref(mockStripe as unknown as Stripe),
    fullName: ref('fake name'),
  })

  await expect(confirmPaymentMethod()).resolves.toBe('token')
  expect(mockStripe.confirmSetup).toHaveBeenCalledTimes(1)
  expect(createNotification).not.toBeCalled()
})

it('confirmPaymentMethod should false token if confirm fail', async () => {
  const mockStripe = {
    confirmSetup: vi.fn().mockResolvedValue({
      error: {
        message: 'error',
      },
      setupIntent: null,
    }),
  }
  const { confirmPaymentMethod } = useTrialCheckout({
    elements: ref({} as StripeElements),
    stripe: ref(mockStripe as unknown as Stripe),
    fullName: ref('fake name'),
  })

  await expect(confirmPaymentMethod()).resolves.toBe(false)
  expect(mockStripe.confirmSetup).toHaveBeenCalledTimes(1)
  expect(createNotification).toHaveBeenCalledTimes(1)
})
