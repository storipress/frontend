import { debounce } from 'lodash-es'
import type { Ref } from 'vue'
import { shallowRef } from 'vue'
import { useDebugLog } from './debug-log'

export interface UseDelayCleanupInput<T> {
  delay?: number
  cleanup: (item: T) => void
}

type Hook<T> = (item: T) => void
type Factory<T> = (onCleanup: (hook: Hook<T>) => void) => T

export interface UseDelayCleanupReturn<T> {
  init: (key: string, factory: Factory<T>) => Ref<T | undefined>
  destroy: (key: string) => void
}

interface ItemMeta<T> {
  inUsed: boolean
  item: Ref<T | undefined>
  hooks: Hook<T>[]
}

export function useDelayCleanup<T>({ delay = 1000, cleanup }: UseDelayCleanupInput<T>): UseDelayCleanupReturn<T> {
  const debug = useDebugLog('delay-cleanup')
  const itemMap = new Map<string, ItemMeta<T>>()

  const doCleanup = debounce((key: string) => {
    const meta = itemMap.get(key)
    if (!meta) {
      return
    }
    const { inUsed, item, hooks } = meta
    if (inUsed || !item.value) {
      return
    }
    const value = item.value
    item.value = undefined
    for (const hook of hooks) {
      hook(value)
    }
    cleanup(value)
    debug(`cleanup ${key}`)
    itemMap.delete(key)
  }, delay)

  return {
    init(key: string, factory: Factory<T>) {
      const old = itemMap.get(key)
      if (old) {
        debug(`reuse ${key}`)
        /*
         * Safety: if the item is mark as inUsed, it won't be cleaned up.
         */
        old.inUsed = true
        return old.item
      }
      debug(`create new ${key}`)
      const meta: ItemMeta<T> = {
        inUsed: true,
        item: shallowRef<T>(),
        hooks: [],
      }
      itemMap.set(key, meta)
      meta.item.value = factory((hook) => {
        meta.hooks.push(hook)
      })
      return meta.item
    },
    destroy(key) {
      const meta = itemMap.get(key)
      if (!meta) {
        return
      }
      // mark it is pending to be cleaned up
      meta.inUsed = false
      doCleanup(key)
    },
  }
}
