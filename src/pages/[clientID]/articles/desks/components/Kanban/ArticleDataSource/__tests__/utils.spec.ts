import { describe, expect, it } from 'vitest'
import { arrayAppendOrReplace } from '../utils'

describe('arrayAppendOrReplace', () => {
  it('should append item when newIndex is greater than currentLength', () => {
    const array = [1, 2, 3]
    const result = arrayAppendOrReplace(array, 4, array.length, 4)
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should replace item when newIndex is not greater than currentLength', () => {
    const array = [1, 2, 3]
    const result = arrayAppendOrReplace(array, 1, array.length, 4)
    expect(result).toEqual([1, 4, 3])
  })

  it('should handle edge cases correctly', () => {
    // Test with empty array
    expect(arrayAppendOrReplace([], 0, 0, 1)).toEqual([1])

    // Test when newIndex equals currentLength
    const array = [1, 2, 3]
    expect(arrayAppendOrReplace(array, 3, array.length, 4)).toEqual([1, 2, 3, 4])
  })
})
