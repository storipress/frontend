import { fireEvent } from '@testing-library/vue'
import StyleGuide from './StyleGuide.vue'
import { render } from '~/test-helpers'

it('renders', async () => {
  const { getByText, getByRole, emitted } = render(StyleGuide, {
    props: {
      errorTitle: 'Error title',
      errorDescription: 'Error message',
    },
  })

  const closeButton = getByRole('button', { name: 'Close' })
  const dismissButton = getByRole('button', { name: 'Dismiss' })

  expect(getByText('Error title')).toBeVisible()
  expect(getByText('Error message')).toBeVisible()
  expect(dismissButton).toBeVisible()
  expect(emitted()).not.toHaveProperty('close')
  expect(emitted()).not.toHaveProperty('dismiss')

  await fireEvent.click(closeButton)

  expect(emitted()).toHaveProperty('close')

  await fireEvent.click(dismissButton)

  expect(emitted()).toHaveProperty('dismiss')
})
