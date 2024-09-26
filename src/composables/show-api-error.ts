import { captureException } from '@sentry/vue'
import { useNotification } from './notification'
import { useKnownAPIErrorsStore } from '~/stores/known-api-errors'

export function useShowAPIError() {
  const { create } = useNotification()
  const store = useKnownAPIErrorsStore()
  whenever(
    () => store.errors.length,
    () => {
      for (const error of store.errors) {
        // mark in OpenReplay and for analytics
        sendTrack('api_error_displayed', {
          code: error.code,
          message: error.message,
          path: error.path,
          operationName: error.operationName,
        })
        captureException(new Error(error.message), (scope) => {
          scope.setTags({
            knownError: true,
            knownErrorCode: error.code,
          })

          scope.setContext('errorInfo', {
            code: error.code,
            path: error.path,
            operationName: error.operationName,
          })

          scope.setFingerprint([String(error.operationName), error.path?.join() ?? '', String(error.code)])

          return scope
        })
        create({
          type: 'warning',
          iconName: 'warning',
          title: error.message,
        })
      }
      store.clear()
    },
  )
}
