import { beforeEach, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import ColorModeButton from '../color-mode-button.vue'
import { render } from '~/test-helpers'

const defaultMode = {
  colorMode: ref('light'),
  currentColorMode: ref('light'),
  icon: ref('line-md:sunny-outline'),
  toggleColorMode: vi.fn(),
}

const currentMode = {
  ...defaultMode,
}

vi.mock('~/composables', () => ({
  useToggleColorMode: vi.fn().mockImplementation(() => currentMode),
}))

beforeEach(() => {
  Object.assign(currentMode, {
    ...defaultMode,
    toggleColorMode: vi.fn(),
  })
})

it('colorModeButton', async () => {
  const { getByLabelText } = render(ColorModeButton)
  const btn = getByLabelText('Switch to dark theme')

  expect(btn).toBeVisible()

  await fireEvent.click(btn)

  expect(currentMode.toggleColorMode).toHaveBeenCalled()
})
