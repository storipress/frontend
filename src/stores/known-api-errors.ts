import { defineStore } from 'pinia'

const ALREADY_HANDLED = new Set<number>([
  // custom domain
  1010020, 1010030,
  // integration oauth
  3040060, 3040070, 3050140,
])

export interface APIKnownError {
  code: number
  message: string
  path?: string[]
  operationName?: string
}

export const useKnownAPIErrorsStore = defineStore('knownErrors', () => {
  const errors = ref<APIKnownError[]>([])

  return {
    errors,
    pushError: (error: APIKnownError) => {
      if (!ALREADY_HANDLED.has(error.code)) {
        errors.value.push(error)
      }
    },
    clear: () => {
      errors.value = []
    },
  }
})
