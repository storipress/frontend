import { fireEvent } from '@testing-library/vue'
import AuthorizationView from './AuthorizationView.vue'

import { render } from '~/test-helpers'

it('renders correctly', async () => {
  const { emitted, getByText, getByRole } = render(AuthorizationView, {
    props: {
      integrationImg: 'https://example.com/image.png',
      text: 'Test Auth',
    },
  })

  const image = getByRole('img')
  expect(image).toHaveAttribute('src', 'https://example.com/image.png')

  expect(getByText('Test Auth')).toBeVisible()

  const connectButton = getByRole('button', { name: 'Connect Account' })
  expect(connectButton).toBeVisible()

  expect(emitted()).not.toHaveProperty('connect')

  await fireEvent.click(connectButton)

  expect(emitted()).toHaveProperty('connect')
  expect(emitted().connect).toHaveLength(1)

  const backButton = getByRole('button', { name: 'Back' })

  expect(emitted()).not.toHaveProperty('back')

  await fireEvent.click(backButton)

  expect(emitted()).toHaveProperty('back')
  expect(emitted().back).toHaveLength(1)
})
