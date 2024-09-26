import { noop, once } from 'lodash-es'
import type { EffectScope } from 'vue'

/**
 * Like `createSharedComposable` but only accept composable which returns a cleanup function.
 *
 * @see https://github.com/vueuse/vueuse/blob/main/packages/shared/createSharedComposable/index.ts
 * @param fn - The function to create the shared effect
 * @returns
 */
export function createSharedDisposableComposable<Fn extends (...args: any[]) => () => void>(composable: Fn) {
  let subscribers = 0
  let cleanup: () => void = noop
  let scope: EffectScope | undefined

  const dispose = () => {
    subscribers -= 1
    if (scope && subscribers <= 0) {
      scope.stop()
      cleanup()
      scope = undefined
    }
    cleanup = noop
  }

  return ((...args) => {
    subscribers += 1
    const disposeOnce = once(dispose)
    if (!scope) {
      scope = effectScope(true)
      cleanup = scope.run(() => composable(...args)) || noop
    }
    tryOnScopeDispose(disposeOnce)
    return disposeOnce
  }) as Fn
}
