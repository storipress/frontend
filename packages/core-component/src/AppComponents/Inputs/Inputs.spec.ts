import { expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import Inputs from './index.vue'

it('input', async () => {
  // Arrange
  const onUpdate = vi.fn()
  const { getByRole, rerender } = render(Inputs, {
    props: {
      label: 'Desk name',
      htmlName: 'desk_name',
      modelValue: '',
      'onUpdate:modelValue': onUpdate,
    },
  })
  const input = getByRole('textbox', {
    name: /desk name/i,
  })

  // Act
  await fireEvent.touch(input)

  // Assert
  expect(onUpdate).not.toBeCalled()

  // Act
  await fireEvent.update(input, 'world news')

  // Assert
  expect(onUpdate).toBeCalledWith('world news')

  // Act
  rerender({ modelValue: 'world news', 'onUpdate:modelValue': onUpdate })

  // Assert
  expect(input).toHaveValue('world news')
})
