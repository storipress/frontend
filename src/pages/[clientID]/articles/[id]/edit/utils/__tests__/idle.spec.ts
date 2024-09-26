import { beforeEach, vi } from 'vitest'
import { useIdleClearEditing } from '../idle'
import { idleTime } from '../../setting'

beforeEach(() => {
  vi.useFakeTimers()

  return () => {
    vi.useRealTimers()
  }
})

describe('useIdleClearEditing', () => {
  // When called, it should clear the value of the editingColumn ref after the idleTime has elapsed.
  it('should clear the value of editingColumn after idleTime has elapsed', () => {
    const editingColumn = ref('column1')
    useIdleClearEditing(editingColumn)
    expect(editingColumn.value).toBe('column1')
    vi.advanceTimersByTime(idleTime)
    expect(editingColumn.value).toBe('')
  })
})
