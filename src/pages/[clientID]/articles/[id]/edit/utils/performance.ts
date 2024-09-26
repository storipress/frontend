import * as Sentry from '@sentry/vue'

export function usePerformance() {
  function checkLoadTime(isLoading: Ref<boolean>) {
    const startTime = Date.now()
    watchOnce(isLoading, () => {
      const endTime = Date.now()
      const diffTime = endTime - startTime
      if (diffTime > 10000) {
        Sentry.captureException(new Error(`Load time exceeded 10 seconds: ${diffTime / 1000}`))
      }
    })
  }
  return { checkLoadTime }
}
