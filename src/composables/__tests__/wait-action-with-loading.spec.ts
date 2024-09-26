import { Effect, Fiber, TestClock, TestContext, pipe } from 'effect'
import { expect, vi } from 'vitest'
import { it } from '@effect/vitest'
import { waitCondition$ } from '../wait-action-with-loading'

const loading = vi.fn()
const ready = vi.fn()

vi.mock('../loading', () => ({
  useLoading: () => ({ loading, ready }),
}))

beforeEach(() => {
  vi.resetAllMocks()
})

it.effect('should work as expected', () => {
  let res = false
  const notifyHandler = vi.fn()
  const checkFn = vi.fn(() => Promise.resolve(res))

  return Effect.gen(function* ($) {
    const fiber = yield* $(
      waitCondition$({
        check: checkFn,
        title: 'test',
        maxRetry: 3,
        notifyOptions: [
          {
            timeout: '2 seconds',
            handler: notifyHandler,
          },
        ],
      }),
      Effect.fork,
    )

    // give fiber some time to execute
    yield* $(TestClock.adjust('100 millis'))

    // initial check
    expect(checkFn).toBeCalledTimes(1)
    expect(loading).not.toBeCalled()

    // increase time for 500ms
    yield* $(TestClock.adjust('500 millis'))

    // first retry will start after 1s, but as 500ms pass, we will start the loading screen
    expect(checkFn).toBeCalledTimes(1)
    expect(loading).toBeCalledTimes(1)
    expect(ready).not.toBeCalled()

    // increase time for 1s
    yield* $(TestClock.adjust('1 seconds'))

    // second check
    expect(checkFn).toBeCalledTimes(2)
    expect(loading).toBeCalledTimes(1)
    expect(ready).not.toBeCalled()
    expect(notifyHandler).not.toBeCalled()

    yield* $(TestClock.adjust('1 seconds'))

    // third check, also the notify timeout pass
    expect(checkFn).toBeCalledTimes(3)
    expect(loading).toBeCalledTimes(1)
    expect(ready).not.toBeCalled()
    expect(notifyHandler).toBeCalledTimes(1)

    // simulate check success
    res = true

    yield* $(TestClock.adjust('1 seconds'))

    // 4th retry, should success
    expect(checkFn).toBeCalledTimes(4)
    expect(loading).toBeCalledTimes(1)
    expect(ready).toBeCalledTimes(1)
    expect(notifyHandler).toBeCalledTimes(1)

    const returned = yield* $(Fiber.join(fiber))
    expect(returned).toBe(true)
  })
})

it.effect('notify work as expected', () => {
  let res = false
  const notifyHandler = vi.fn()
  const checkFn = vi.fn(() => Promise.resolve(res))

  return Effect.gen(function* ($) {
    const fiber = yield* $(
      waitCondition$({
        check: checkFn,
        title: 'test',
        maxRetry: 20,
        notifyOptions: [
          {
            timeout: '2 seconds',
            handler: notifyHandler,
          },
          {
            timeout: '4 seconds',
            handler: notifyHandler,
          },
        ],
      }),
      Effect.fork,
    )

    // give fiber some time to execute
    yield* $(TestClock.adjust('100 millis'))

    // initial check
    expect(checkFn).toBeCalledTimes(1)
    expect(loading).not.toBeCalled()

    // increase time for 500ms
    yield* $(TestClock.adjust('500 millis'))

    // first retry will start after 1s, but as 500ms pass, we will start the loading screen
    expect(checkFn).toBeCalledTimes(1)
    expect(loading).toBeCalledTimes(1)
    expect(ready).not.toBeCalled()

    // increase time for 1s
    yield* $(TestClock.adjust('1 seconds'))

    // second check
    expect(checkFn).toBeCalledTimes(2)
    expect(loading).toBeCalledTimes(1)
    expect(ready).not.toBeCalled()
    expect(notifyHandler).not.toBeCalled()

    yield* $(TestClock.adjust('1 seconds'))

    // third check, also the notify timeout pass
    expect(checkFn).toBeCalledTimes(3)
    expect(loading).toBeCalledTimes(1)
    expect(ready).not.toBeCalled()
    expect(notifyHandler).toBeCalledTimes(1)

    yield* $(TestClock.adjust('2 seconds'))

    // 2ed notify
    expect(checkFn).toBeCalledTimes(5)
    expect(notifyHandler).toBeCalledTimes(2)

    // simulate check success
    res = true

    yield* $(TestClock.adjust('1 seconds'))

    const returned = yield* $(Fiber.join(fiber))
    expect(returned).toBe(true)
  })
})
