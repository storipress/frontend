import { expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { Template } from './index.stories'

it('popover', async () => {
  // Arrange
  const onClick = vi.fn()
  const { queryByText, getByRole, getByText } = render(Template(), {
    props: {
      onClick,
    },
    slots: { default: 'Popover Button', content: 'Popover Content' },
  })
  const popover = getByRole('button', { name: 'Popover Button' })

  expect(popover).not.toHaveClass('tooltip')

  await popover.focus()

  // Act
  await fireEvent.click(popover)

  // Assert
  expect(getByText('Popover Content')).toBeInTheDocument()
  expect(getByText('Popover Content')).toHaveAttribute('data-headlessui-state', 'open')

  // Close popover after click popover button
  await fireEvent.click(popover)
  expect(queryByText('Popover Content')).not.toBeInTheDocument()

  // Toggle popover again
  await fireEvent.click(popover)
  expect(getByText('Popover Content')).toBeInTheDocument()
  await fireEvent.click(popover)
  expect(queryByText('Popover Content')).not.toBeInTheDocument()
})
