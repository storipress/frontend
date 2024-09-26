import { expect, vi } from 'vitest'
import { it } from '@effect/vitest'
import * as Y from 'yjs'
import { Effect, Exit, Fiber, Option } from 'effect'
import type { DeferredPromise } from 'p-defer'
import pDefer from 'p-defer'
import { z } from 'zod'
import { awaitInitApi, checkIfDuplicated, defineYdocMap } from '../utils/ydoc'

beforeEach(() => {
  vi.useFakeTimers()

  return () => {
    vi.useRealTimers()
  }
})

it('check if inputValue is duplicated', () => {
  expect(checkIfDuplicated('11')).toBe(true)
  expect(checkIfDuplicated('12')).toBe(false)
  expect(checkIfDuplicated('121')).toBe(false)
  expect(checkIfDuplicated('')).toBe(false)
  expect(checkIfDuplicated('TestTest')).toBe(true)
})

it.effect('should await init api', () => {
  const deferred = [pDefer(), pDefer(), pDefer()] as [
    DeferredPromise<unknown>,
    DeferredPromise<unknown>,
    DeferredPromise<unknown>,
  ]

  return Effect.gen(function* ($) {
    const setStatus = vi.fn()
    const fiber = yield* $(Effect.fork(awaitInitApi(deferred, setStatus)))

    yield* $(Effect.yieldNow())

    expect(setStatus).toBeCalledTimes(1)
    expect(setStatus).toBeCalledWith(true)

    // not resolve yet
    const status1 = yield* $(Fiber.poll(fiber))
    expect(Option.isNone(status1)).toBe(true)

    deferred[0].resolve()

    const status2 = yield* $(Fiber.poll(fiber))
    expect(Option.isNone(status2)).toBe(true)

    deferred[1].resolve()
    deferred[2].resolve()

    const status3 = yield* $(Fiber.await(fiber))
    expect(Exit.isSuccess(status3)).toBe(true)
    expect(setStatus).toBeCalledWith(false)
  })
})

it('check defineYdocMap', () => {
  const ydoc = new Y.Doc()
  let mapSet

  vi.spyOn(ydoc, 'getMap').mockImplementation(() => {
    const map = new Y.Map()
    mapSet = vi.spyOn(map, 'set')
    return map
  })

  const map = defineYdocMap({
    ydoc,
    name: 'test',
    schema: z.string(),
  })

  map.set('value')
  expect(mapSet).toHaveBeenCalledWith('test', 'value')
})
