import { expect, it } from 'vitest'

it('intersectionObserver', () => {
  expect(window.IntersectionObserver).toBeTruthy()
  expect(window.IntersectionObserver).toBeInstanceOf(Function)
})
