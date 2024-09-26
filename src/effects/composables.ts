import { Cause, Effect, Fiber, Runtime, pipe } from 'effect'
import { provideApiService } from './services/ApiService'
import { useApolloClient } from '~/lib/apollo'

export function useEffectRuntime() {
  const runFork = Runtime.runFork(Runtime.defaultRuntime)
  const _runPromise = Runtime.runPromise(Runtime.defaultRuntime)
  const runSync = Runtime.runSync(Runtime.defaultRuntime)

  const runPromise = <A, E>(effect: Effect.Effect<A, E>) =>
    pipe(
      effect,
      Effect.catchAllCause((cause) => {
        if (Cause.isInterruptedOnly(cause)) {
          return Effect.void
        }
        return Effect.failCause(cause)
      }),
      _runPromise,
    )

  return {
    runFork,
    runPromise,
    runSync,
  }
}

export function useEffectScoped() {
  const runtime = useEffectRuntime()

  // abort all the fiber on the scope dispose
  onScopeDispose(() => {
    runtime.runFork(pipe(Fiber.roots, Effect.flatMap(Fiber.interruptAll)))
  })

  return runtime
}

export function useApiLive() {
  const { client } = useApolloClient()

  return provideApiService(client)
}
