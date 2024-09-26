import { expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import MenuLink from './MenuLink.vue'
import { render } from '~/test-helpers'

it('event success', async () => {
  const { getByRole, emitted } = render(MenuLink)
  const input = getByRole('textbox')
  const deleteButton = getByRole('button')

  expect(emitted()).not.toHaveProperty('change')
  await fireEvent.blur(input)
  expect(emitted()).toHaveProperty('change')

  await fireEvent.update(input, '123')
  expect(emitted()).toHaveProperty('update:modelValue')
  expect(emitted()['update:modelValue'][0]).toEqual(['123'])

  expect(emitted()).not.toHaveProperty('delete')
  await fireEvent.click(deleteButton)
  expect(emitted()).toHaveProperty('delete')
})
