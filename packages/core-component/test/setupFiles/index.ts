import { mockIntersectionObserver } from 'jsdom-testing-mocks'

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/vue'
import type { MockInstance } from 'vitest'
import { afterEach, beforeEach, vi } from 'vitest'

mockIntersectionObserver()

let randomSpy: MockInstance

beforeEach(() => {
  randomSpy = vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.123456789)
})

afterEach(() => {
  randomSpy.mockRestore()
  cleanup()
})
