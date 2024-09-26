import { resolveSelector } from '../test-utils'

describe('resolveSelector', () => {
  it('resolve normal css class', () => {
    expect(resolveSelector(['foo', 'bar'])).toBe('.bar')
  })

  it('resolve tag selector', () => {
    expect(resolveSelector(['foo', '& a'])).toBe('.foo a')
  })
})
