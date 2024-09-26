import { expect, it } from 'vitest'
import License from '../license.vue'
import { render } from '~/test-helpers'

it('renders', () => {
  const { getByRole } = render(License)

  expect(getByRole('button')).toBeVisible()
  expect(getByRole('button')).toHaveTextContent('Activate')

  expect(getByRole('textbox')).toBeVisible()
})
