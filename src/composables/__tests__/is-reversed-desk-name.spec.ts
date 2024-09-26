import { expect, it } from 'vitest'
import { isReversedDeskName } from '../is-reversed-desk-name'

it('isReversedDeskName', () => {
  expect(isReversedDeskName('all')).toBe(true)
  expect(isReversedDeskName('featured')).toBe(true)
  expect(isReversedDeskName('mine')).toBe(true)
  expect(isReversedDeskName('alll')).toBe(false)
  expect(isReversedDeskName('featureddd')).toBe(false)
  expect(isReversedDeskName('minee')).toBe(false)
})
