import { isMenuType } from '../utils'

it('check if inputType in menu defined type', () => {
  expect(isMenuType('toggleAI')).toBe(true)
  expect(isMenuType('toggleBold')).toBe(true)
  expect(isMenuType('test')).toBe(false)
  expect(isMenuType('')).toBe(false)
  expect(isMenuType(undefined)).toBe(false)
})
