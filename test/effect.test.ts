import { Cause, Chunk, Duration, Effect, Fiber, FiberId, Option, Schedule, TestClock, TestContext, pipe } from 'effect'
import invariant from 'tiny-invariant'
import { it } from 'vitest'

it('should retry as expected', async () => {
  let i = 0
  let j = 0

  await pipe(
    Effect.sync(() => i++),
    Effect.tap(() => Effect.sync(() => j++)),
    Effect.flatMap(() => (i + j === 4 ? Effect.void : Effect.fail('fail'))),
    Effect.retry(Schedule.recurs(3)),
    Effect.runPromise,
  )

  expect(i).toBe(2)
  expect(j).toBe(2)
})

it('should stop retry if match condition', async () => {
  let i = 0

  await pipe(
    Effect.sync(() => i++),
    Effect.flatMap(() => (i > 2 ? Effect.fail('skip') : Effect.fail('fail'))),
    Effect.retry({
      while: (error) => error !== 'skip',
    }),
    Effect.runPromiseExit,
  )

  expect(i).toBe(3)
})

it('should retry with waiting and stop at specific time', async () => {
  const start = Date.now()
  let i = 0

  await pipe(
    Effect.sync(() => i++),
    Effect.flatMap(() => Effect.fail('error')),
    Effect.retry({
      schedule: Schedule.spaced(Duration.millis(100)),
      times: 1,
    }),
    Effect.runPromiseExit,
  )

  const end = Date.now()

  expect(i).toBe(2)
  expect(end - start).toBeLessThan(200)
  expect(end - start).toBeGreaterThan(90)
})

it('should die if async callback throw', async () => {
  await pipe(
    Effect.async<never, never, never>(() => {
      throw new Error('fail')
    }),
    Effect.catchAllDefect((e) => {
      expect(e).toBeInstanceOf(Error)
      invariant(e instanceof Error)
      expect(e.message).toBe('fail')
      return Effect.void
    }),
    Effect.runPromise,
  )
})

it('should die if sync callback throw', async () => {
  await pipe(
    Effect.sync(() => {
      throw new Error('fail')
    }),
    Effect.catchAllDefect((e) => {
      expect(e).toBeInstanceOf(Error)
      invariant(e instanceof Error)
      expect(e.message).toBe('fail')
      return Effect.void
    }),
    Effect.runSync,
  )
})

it('can timeout', async () => {
  const program = pipe(Effect.sleep('5 minutes'), Effect.timeout('1 minutes'), Effect.option)
  await pipe(
    Effect.gen(function* ($) {
      const shouldTimeout = yield* $(Effect.fork(program))

      // Try poll fiber to confirm not exit yet
      const poll = yield* $(Fiber.poll(shouldTimeout))

      expect(Option.isNone(poll)).toBe(true)

      yield* $(TestClock.adjust('1 minutes'))

      const result = yield* $(Fiber.join(shouldTimeout))

      expect(Option.isNone(result)).toBe(true)
    }),
    Effect.provide(TestContext.TestContext),
    Effect.runPromise,
  )
})

it('can catch cause error', async () => {
  expect.assertions(2)
  await pipe(
    Effect.fail('error'),
    Effect.catchAllCause((cause) => {
      expect(Cause.isFailure(cause)).toBe(true)
      expect(Chunk.toArray(Cause.failures(cause))).toEqual(['error'])
      return Effect.void
    }),
    Effect.runPromise,
  )
})

it('can catch cause interrupt', async () => {
  expect.assertions(1)
  await pipe(
    Effect.failCause(Cause.interrupt(FiberId.make(1, 0))),
    Effect.catchAllCause((cause) => {
      expect(Cause.isInterruptedOnly(cause)).toBe(true)
      return Effect.void
    }),
    Effect.runPromise,
  )
})

it.fails('will fail with interrupt error if we give infinite promise', () => {
  expect.assertions(1)

  const infiniteEffect = pipe(
    Effect.promise(() => new Promise(() => {})),
    Effect.catchAllCause((cause) => {
      // this will not work as fiber runtime will not execute next command but only drain current queue
      expect(Cause.isInterruptedOnly(cause)).toBe(true)
      return Effect.void
    }),
  )

  const fiber = Effect.runFork(infiniteEffect)
  return new Promise<void>((resolve) => {
    fiber.addObserver(() => {
      resolve()
    })

    Effect.runSync(Fiber.interruptFork(fiber))
  })
})
