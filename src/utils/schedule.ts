import { noop } from 'lodash-es'
import type { Promisable } from 'type-fest'
import pDefer from 'p-defer'

export interface PollingParams {
  controller: AbortController
  count: number
}

export interface PollingInput<T> {
  delay?: number
  interval?: number
  limit?: number
  timeout?: number
  stopWhen?: (res: T, ctx: PollingParams) => boolean
  callback: (params: PollingParams) => Promisable<T>
  onError?: (error: unknown) => void
}

type Timeout = ReturnType<typeof setTimeout>

export function polling<T = void>({
  interval = 500,
  delay = 0,
  limit = 10,
  callback,
  timeout = 10_000,
  stopWhen = () => false,
  onError = noop,
}: PollingInput<T>): Promise<T | null> {
  const controller = new AbortController()

  const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null
  let nextPollingId: Timeout | null = null
  let count = 0
  const deferred = pDefer<T | null>()
  let lastRes: T | null = null

  const polling = async () => {
    if (count === limit) {
      if (nextPollingId) {
        clearTimeout(nextPollingId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      return deferred.resolve(lastRes)
    }
    if (controller.signal.aborted) {
      return deferred.resolve(lastRes)
    }
    try {
      lastRes = await callback({ controller, count })
      if (stopWhen(lastRes, { controller, count })) {
        controller.abort()
        return deferred.resolve(lastRes)
      }
    } catch (error) {
      onError(error)
      return deferred.reject(error)
    }
    count += 1
    nextPollingId = setTimeout(polling, interval)
  }

  setTimeout(polling, delay)

  return deferred.promise
}
