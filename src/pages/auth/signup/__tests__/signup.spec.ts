import { fireEvent } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { identity } from 'lodash'
import { expect, it, vi } from 'vitest'
import { useSignupStore } from '~/stores/signup'
import { render } from '~/test-helpers'
import SignUp from '../index.vue'

let query = {}
const routePush = vi.fn()
const routeReplace = vi.fn()

vi.mock('vue-router', async () => ({
  ...(await vi.importActual('vue-router')),
  useRouter: () => ({
    push: routePush,
    replace: routeReplace,
  }),
  useRoute: () => ({
    query,
  }),
}))

const mutate = vi.fn(() => {
  return { data: { signUp: { access_token: 'token' } } }
})

vi.mock('~/lib/apollo', async () => {
  return {
    ...(await vi.importActual('~/lib/apollo')),
    useMutation: () => ({
      mutate: (...args: any[]) => {
        // @ts-expect-error ignore
        mutate(...args)
        return { data: { signUp: { access_token: 'token' } } }
      },
    }),
  }
})

vi.mock('vee-validate', () => {
  return {
    ...(vi.importActual('vee-validate') as any),
    defineRule: vi.fn(),
    configure: vi.fn(),
    useField: vi.fn(),
    useForm: vi.fn(() => ({
      setFieldError: vi.fn(),
      handleSubmit: identity,
    })),
    useVuelidate: vi.fn(),
    setInteractionMode: vi.fn(),
    localize: vi.fn(),
    install: vi.fn(),
    version: '4.0.0-rc.1',
  }
})

window.gr = () => {}

beforeEach(() => {
  mutate.mockReset()
})

it.skip('renders license code', () => {
  query = { source: 'viededingue' }
  const { getByLabelText } = render(SignUp)

  expect(getByLabelText('License code')).toBeVisible()
})

it.skip('can signup', async () => {
  query = {}
  const { getByLabelText, getByRole } = render(SignUp)
  const signupStore = useSignupStore()

  const emailInput = getByLabelText('Your company email')
  const firstNameInput = getByLabelText('First name')
  const lastNameInput = getByLabelText('Last name')
  const passwordInput = getByLabelText('Password')
  const companyInput = getByLabelText('Company name')
  const nextButton = getByRole('button', { name: 'Next' })

  expect(emailInput).toBeVisible()
  expect(firstNameInput).toBeVisible()
  expect(lastNameInput).toBeVisible()
  expect(passwordInput).toBeVisible()
  expect(companyInput).toBeVisible()
  expect(nextButton).toBeVisible()

  Object.assign(signupStore.signupInfo, {
    email: 'signup@storipress.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password1234',
    publicationName: 'Company name',
  })

  await nextTick()
  await flushPromises()

  expect(nextButton).toBeEnabled()

  await fireEvent.click(nextButton)

  expect(mutate).toBeCalled()
  expect(routeReplace).toBeCalled()
})
