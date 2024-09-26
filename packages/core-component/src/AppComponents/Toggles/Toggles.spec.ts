import { expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import Toggles from './index.vue'

it('toggle', async () => {
  // Arrange
  const onUpdate = vi.fn()
  const { getByRole, rerender } = render(Toggles, {
    props: {
      type: 'simple',
      modelValue: false,
      'onUpdate:modelValue': onUpdate,
    },
  })
  const toggle = getByRole('switch')

  expect(toggle).toHaveClass('bg-stone-200')

  // Act
  await fireEvent.click(toggle)

  // Assert
  expect(onUpdate).toBeCalled()

  // Act
  await rerender({ modelValue: true, 'onUpdate:modelValue': onUpdate })

  // Assert
  expect(toggle).not.toHaveClass('bg-stone-200')
})
