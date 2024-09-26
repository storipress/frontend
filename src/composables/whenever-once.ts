import { whenever } from '@vueuse/core'
import type { WatchCallback, WatchOptions, WatchSource } from 'vue'

export function wheneverOnce<T = void>(
  source: WatchSource<T | null | undefined | false>,
  cb: WatchCallback<T>,
  options: WatchOptions<boolean> = {},
) {
  const stop = whenever(
    source,
    (...args) => {
      nextTick(() => stop())
      cb(...args)
    },
    options,
  )
  return stop
}
