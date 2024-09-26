import { vi } from 'vitest'

export const analytics = {
  ready: () => Promise.resolve(),
  track: vi.fn(),
  identity: vi.fn(),
  page: vi.fn(),
}

export const sendTrackUnchecked = vi.fn()
export const sendTrack = vi.fn()
export const sendIdentify = vi.fn()
export const getUTM = vi.fn()
