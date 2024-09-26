import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createBatch } from '../batch'

describe('createBatch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("won't call executor until time up", () => {
    const executor = vi.fn()
    const { batchUpdate } = createBatch(executor)
    batchUpdate({ foo: 'bar' })
    batchUpdate({ baz: 'qux' })
    expect(executor).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(executor).toHaveBeenCalledTimes(1)
    expect(executor).toHaveBeenCalledWith({ foo: 'bar', baz: 'qux' })
  })

  it('new value will override old value', () => {
    const executor = vi.fn()
    const { batchUpdate } = createBatch(executor)
    batchUpdate({ foo: 'bar' })
    batchUpdate({ foo: 'qux' })
    expect(executor).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(executor).toHaveBeenCalledTimes(1)
    expect(executor).toHaveBeenCalledWith({ foo: 'qux' })
  })
})
