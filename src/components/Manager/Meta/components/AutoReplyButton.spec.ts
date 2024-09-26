import { expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import AutoReplyButton from './AutoReplyButton.vue'
import { render } from '~/test-helpers'

it('event success', async () => {
  const { getByRole, emitted } = render(AutoReplyButton)
  const button = getByRole('button')

  expect(emitted()).not.toHaveProperty('generateResponse')
  await fireEvent.click(button)
  expect(emitted()).toHaveProperty('generateResponse')
})
