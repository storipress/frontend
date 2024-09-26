import Authorized from './Authorized.vue'
import { render } from '~/test-helpers'

it('renders correctly', () => {
  const { getAllByRole, getByText } = render(Authorized, {
    props: {
      integrationImg: 'https://example.com/facebook.png',
      integrationData: {
        name: 'John Doe',
      },
    },
  })

  expect(getByText('John Doe')).toBeVisible()
  expect(getAllByRole('button')).toHaveLength(1)
})
