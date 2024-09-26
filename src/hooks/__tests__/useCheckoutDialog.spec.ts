import { setActivePinia } from 'pinia'
import { captureException } from '@sentry/vue'
import { PlanStatus, useCheckoutDialog } from '../useCheckoutDialog'
import { mockResponseOnce, setupApolloClient, setupTestPinia } from '~/test-helpers'
import GetBilling from '~/mocks/graphql/GetBilling'
import GetSiteCustomSite from '~/mocks/graphql/GetSiteCustomSite'

vi.mock('@sentry/vue', async () => ({
  ...(await vi.importActual('@sentry/vue')),
  captureException: vi.fn(),
}))

beforeEach(() => {
  setActivePinia(setupTestPinia())
  setupApolloClient()
})

it('should return checkout info', async () => {
  const checkoutDialog = useCheckoutDialog()

  await until(() => checkoutDialog.loading.value).toBe(false)
  await until(() => checkoutDialog.billing.value).toBeTruthy()

  expect(reactive(checkoutDialog)).toMatchSnapshot()
})

// FIXME: this test can pass if we add `.only` on it, seems it's a cache issue
it.skip('should warn for unknown plan', async () => {
  mockResponseOnce(GetSiteCustomSite, {
    site: {
      plan: 'unknown',
    },
  })
  mockResponseOnce(GetBilling, {
    billing: {
      plan: 'unknown',
    },
  })
  const checkoutDialog = useCheckoutDialog()

  await until(() => checkoutDialog.loading.value).toBe(false)
  await until(() => checkoutDialog.billing.value).toBeTruthy()

  expect(checkoutDialog.planStatus.value).toBe(PlanStatus.Free)

  expect(captureException).toHaveBeenCalledTimes(1)
  expect(captureException).toHaveBeenCalledWith(new Error('found unknown plan: unknown'))
  expect(reactive(checkoutDialog)).toMatchSnapshot()
})
