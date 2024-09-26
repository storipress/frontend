import { expect, it } from 'vitest'
import { useToggleColorMode } from '../toggle-color-mode'

it('toggle color mode', async () => {
  const { currentColorMode, toggleColorMode, icon } = useToggleColorMode()

  expect(currentColorMode.value).toBe('light')
  expect(icon.value).toBe('line-md:sunny-outline')

  await toggleColorMode()

  expect(currentColorMode.value).toBe('dark')
  expect(icon.value).toBe('line-md:sunny-outline-to-moon-transition')

  await toggleColorMode()

  expect(currentColorMode.value).toBe('light')
  expect(icon.value).toBe('line-md:moon-to-sunny-outline-transition')
})
