import { expect, it } from 'vitest'
import { isIntegrationConnectedWithData } from './integration-helper'

it.each([
  ['a', true],
  [1, true],
  [true, true],
  [[], false],
  [null, false],
  [undefined, false],
  [{}, false],
  [{ a: 1 }, true],
])('isIntegrationConnectedWithData can validate data', (data, expected) => {
  expect(isIntegrationConnectedWithData(data)).toBe(expected)
})
