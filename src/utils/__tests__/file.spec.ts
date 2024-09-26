import { it } from 'vitest'
import { filterSupportImageFiles, isSupportedImageMime } from '../file'

describe('isSupportedImageMime', () => {
  it.each(['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg'])('can check supported images `%s`', (mime) => {
    expect(isSupportedImageMime(`image/${mime}`)).toBe(true)
  })

  it('can check unsupported images', () => {
    expect(isSupportedImageMime('image/heic')).toBe(false)
  })
})

describe('filterSupportedImageFiles', () => {
  it('can filter supported images', () => {
    const files = [
      { type: 'image/jpeg' } as File,
      { type: 'image/png' } as File,
      { type: 'image/gif' } as File,
      { type: 'image/webp' } as File,
      { type: 'image/svg' } as File,
      { type: 'image/heic' } as File,
    ]

    const filtered = filterSupportImageFiles(files)

    expect(filtered).toContainEqual({ type: 'image/jpeg' })
    expect(filtered).toContainEqual({ type: 'image/png' })
    expect(filtered).not.toContainEqual({ type: 'image/heic' })
  })
})
