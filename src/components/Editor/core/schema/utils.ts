import * as Sentry from '@sentry/vue'

const FIVE_MB = 5 * 1024 * 1024

export function isFileExceedSizeLimit(file: File): boolean {
  return file.size > FIVE_MB
}

export function assertJSON(s: string | undefined) {
  if (!s) {
    return null
  }

  try {
    JSON.parse(s)
    return s
  } catch (error) {
    Sentry.captureException(new Error('Invalid json', { cause: error as Error }), (scope) => {
      scope.setContext('json', s as any)
      return scope
    })
    return null
  }
}

export function safeParse(s: string | undefined) {
  if (!s) {
    return null
  }

  try {
    return JSON.parse(s)
  } catch (error) {
    Sentry.captureException(new Error('Invalid json', { cause: error as Error }), (scope) => {
      scope.setContext('json', s as any)
      return scope
    })
    return null
  }
}
