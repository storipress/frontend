import type { Duration } from 'effect'
import { Cause, Effect, Either, Exit, Fiber, Option, Schedule, identity, pipe } from 'effect'
import type { Promisable } from 'type-fest'
import { noop } from 'lodash-es'
import type { DescriptionOptions } from './loading'
import { useLoading } from './loading'

export interface NotifyOption {
  timeout: Duration.DurationInput
  description?: string
  handler?: () => Promisable<void>
}

interface WaitConditionInput<T = unknown> {
  check: () => Promise<T | null | undefined | false>
  title: string
  descriptionOptions?: DescriptionOptions
  notifyOptions?: NotifyOption[]
  retryInterval?: Duration.DurationInput
  initialDelay?: Duration.DurationInput
  maxRetry?: number
  beforeReturn?: (
    ctx: Pick<ReturnType<typeof useLoading>, 'loading' | 'ready' | 'showDescription' | 'transformDescription'>,
  ) => Promisable<void>
}

export function useWaitCondition<T>(input: WaitConditionInput<T>) {
  return () => Effect.runPromise(waitCondition$(input))
}

export function waitCondition$<T>({
  check,
  title,
  descriptionOptions,
  retryInterval = '1 seconds',
  maxRetry = 100,
  initialDelay = '500 millis',
  beforeReturn = noop,
  notifyOptions = [],
}: WaitConditionInput<T>): Effect.Effect<T | null> {
  const { loading, ready, transformDescription, showDescription } = useLoading()

  const waitSuccess$ = pipe(
    Effect.promise(() => {
      return check()
    }),
    Effect.map((res) => normalizeResult(res)),
    Effect.flatMap((x) =>
      Option.match(x, {
        onSome: (item) => Effect.succeed(item),
        onNone: () => Effect.fail(new Cause.NoSuchElementException()),
      }),
    ),
    Effect.retry(Schedule.intersect(Schedule.fixed(retryInterval), Schedule.recurs(maxRetry))),
    Effect.either,
  )

  return Effect.gen(function* ($) {
    const waitingFiber = yield* $(Effect.fork(waitSuccess$))

    // wait initialDelay
    yield* $(Effect.sleep(initialDelay))

    // we finish the check within `initialDelay`, so no need to show loading, just return
    // This is used to prevent a flashing loading screen
    const initialRes = yield* $(Fiber.poll(waitingFiber))
    if (Option.isSome(initialRes)) {
      const either = Exit.getOrElse(initialRes.value, () => Either.left(null))
      return Either.match(either, {
        onRight: identity,
        onLeft: () => null,
      })
    }

    // start loading screen
    loading({
      title,
      loadingIcon: true,
    })

    // setup loading description
    const descriptionFiber = yield* $(
      Effect.fork(descriptionOptions ? Effect.promise(() => transformDescription(descriptionOptions)) : Effect.void),
    )

    // now, setup the notify
    const notifyFibers = yield* $(
      Effect.all(
        notifyOptions.map((opt) =>
          pipe(
            // ! we assume user will set a larger timeout if they want to update the description, otherwise, it will break the UI
            Effect.sleep(opt.timeout),
            // on timeout, execute user's handler and show description
            Effect.tap(() => {
              if (opt.description) {
                showDescription(opt.description)
              }
              opt.handler?.()
              return Effect.void
            }),
            // put it to background
            Effect.fork,
          ),
        ),
        { concurrency: 'unbounded' },
      ),
    )

    // now, wait the main job to finish
    const res = yield* $(Fiber.join(waitingFiber))

    // abort all the ongoing notify thread
    yield* $(Fiber.interruptAll(notifyFibers))

    // wait description transition finish to make UI better
    yield* $(Fiber.join(descriptionFiber))

    const finalResult = Either.match(res, {
      onRight: identity,
      onLeft: () => null,
    })

    if (finalResult) {
      yield* $(
        Effect.promise(() => Promise.resolve(beforeReturn({ loading, ready, showDescription, transformDescription }))),
      )

      // close loading screen
      ready()
    }

    return finalResult
  })
}

function normalizeResult<T>(result: T | false | null | undefined): Option.Option<T> {
  return result === false ? Option.none() : Option.fromNullable(result)
}
