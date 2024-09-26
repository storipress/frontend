import { expect, it, vi } from 'vitest'
import { sendLinkedInConvert } from '../linkedin-track'

beforeEach(() => {
  window.lintrk = vi.fn()
})

it('send conversion work', async () => {
  await sendLinkedInConvert(12345)

  expect(window.lintrk).toHaveBeenCalledWith('track', { conversion_id: 12345 })
})

it('no error if no linkedin load', async () => {
  window.lintrk = undefined

  await expect(async () => {
    await sendLinkedInConvert(12345)
  }).not.toThrow()
})
