import { expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import Modals from './index.vue'

it('modal', async () => {
  // Arrange
  const onOnModalClose = vi.fn()
  const { getByRole } = render(Modals, {
    props: { visible: true, onOnModalClose },
    slots: { default: 'Modal Content' },
  })
  const dialog = getByRole('dialog')

  expect(dialog).toBeInTheDocument()

  // Act
  const close = getByRole('button', { name: 'close' })
  await fireEvent.click(close)

  // Assert
  expect(onOnModalClose).toHaveBeenCalledTimes(1)
})
