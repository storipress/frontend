import { expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import GraphButton from './GraphButton.vue'

it('graphButton', async () => {
  // Arrange
  const onClick = vi.fn()
  const { getByText } = render(GraphButton, {
    props: {
      onClick,
      active: false,
    },
    slots: {
      default: 'Subscribers',
    },
  })
  expect(onClick).not.toBeCalled()

  const button = getByText('Subscribers')
  await fireEvent.click(button)

  expect(onClick).toBeCalled()
})
