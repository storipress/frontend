import * as Sentry from '@sentry/vue'
import { serializeError } from 'serialize-error'
import type { ApolloError } from '@apollo/client/errors'
import { isString } from 'lodash-es'
import { isApolloError } from '@apollo/client/core'
import { Cause, Runtime } from 'effect'
import type { UserModule } from '~/types'
import { env } from '~/env'
import { __IS_DEV__ } from '~/lib/env'

const dist = import.meta.env.VITE_PLUGIN_SENTRY_CONFIG.dist
const release = import.meta.env.VITE_PLUGIN_SENTRY_CONFIG.release
const isDev = __IS_DEV__
const mode = env.DEV ? 'dev' : env.MODE
const sampleRate: Record<string, number> = {
  dev: 0,
  staging: 0,
  production: 0.001,
}

function unknownIsApolloError(x: unknown): x is ApolloError {
  return Boolean(typeof x === 'object' && x && isApolloError(x as Error))
}

function isError(x: unknown): x is Error {
  return Boolean(typeof x === 'object' && x && x instanceof Error)
}

function checkE2E() {
  return localStorage.getItem('env') === 'e2e'
}
const isE2E = checkE2E()

const ERROR_ADD_OPERATION_NAME = new Set(['Bad Request.', 'Internal server error'])

export const install: UserModule = ({ app, router }) => {
  Sentry.init({
    app,
    dist,
    release,
    dsn: env.VITE_SENTRY_DSN,
    environment: env.VITE_SENTRY_ENV,
    tunnel: 'https://report-uri.stori.press/sentry',
    logErrors: isDev,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    tracesSampleRate: sampleRate[mode] ?? sampleRate.dev,
    replaysSessionSampleRate: isE2E ? 0 : 0.05,
    replaysOnErrorSampleRate: isE2E ? 0 : 1.0,
    // https://docs.sentry.io/platforms/javascript/guides/vue/performance/instrumentation/automatic-instrumentation/#tracingorigins
    tracePropagationTargets: ['api.storipress.dev', 'api.storipress.pro', 'api.stori.press', 'localhost', '127.0.0.1'],
    beforeSend(event, hint) {
      let exception = hint.originalException

      if (Runtime.isFiberFailure(exception)) {
        exception = exception[Runtime.FiberFailureCauseId]
      }

      if (Cause.isCause(exception)) {
        // ignore interrupted error
        if (Cause.isInterrupted(exception)) {
          return null
        }
        exception = Cause.squash(exception)
      }

      if (unknownIsApolloError(exception) && exception?.graphQLErrors?.[0]) {
        const error = exception.graphQLErrors[0]
        const validationKey = Object.keys(error?.extensions?.validation || {})?.[0]
        const message = error.message
        const errorPath = (error.path || []).filter((path): path is string => isString(path))

        if (ERROR_ADD_OPERATION_NAME.has(error.message) && event.exception?.values?.[0].value) {
          event.exception.values[0].value += errorPath.length > 1 ? ` [${errorPath.join(', ')}]` : ` [${errorPath[0]}]`
        }

        event.fingerprint = [message, ...errorPath, validationKey]
      }

      if (isError(exception) && exception.cause) {
        event.contexts ??= {}
        event.contexts.cause = {
          value: exception.cause instanceof Error ? serializeError(exception.cause) : exception.cause,
        }
      }
      return event
    },
    ignoreErrors: [
      // network errors
      'error loading dynamically imported module',
      'Failed to fetch',
      'Network request failed',
      'NetworkError when attempting to fetch resource.',
      'timeout of 2000ms exceeded',
      'The request timed out',
      'Unable to preload CSS',

      // open replay
      'OpenReplay',
      'FontFaceInterceptor',
      '__openreplay_id',

      // invalid token or permissions
      'Unauthenticated',
      'Forbidden',

      // too many requests
      'Rate limit for',

      // quota limit by billing
      'Quota Exceeded',

      // Playwright E2E tests
      'playwright',
      'while parsing selector',

      // invalid client id
      'Not found',

      // unsupported feature
      'not implemented',

      // firefox extensions
      'moz-extension',

      // Same-origin policy
      'Blocked a frame with origin',

      // rrweb ref: https://github.com/rrweb-io/rrweb/issues/1057
      "Cannot read properties of undefined (reading 'prototype')",

      // cloudflare
      'beacon.min.js',
    ],
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
        maskAllInputs: false,
        networkDetailAllowUrls: ['api.storipress.dev', 'api.storipress.pro', 'api.stori.press'],
      }),
      Sentry.extraErrorDataIntegration(),
      Sentry.browserTracingIntegration({
        router,
      }),
    ],
  })
}
