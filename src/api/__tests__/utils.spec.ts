import { setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { GraphQLError } from 'graphql'
import { findKnownErrors, reportKnownErrors } from '../utils'
import { setupTestPinia } from '~/test-helpers'
import { useKnownAPIErrorsStore } from '~/stores/known-api-errors'

beforeEach(() => {
  setActivePinia(setupTestPinia())
})

describe('findKnownErrors', () => {
  it('should find known error', () => {
    const errors = findKnownErrors([
      {
        message: 'test',
        extensions: {
          code: 42,
        },
      },
    ])
    expect(errors).toHaveLength(1)
    expect(errors).toEqual([
      {
        message: 'test',
        extensions: {
          code: 42,
        },
      },
    ])
  })

  it('should ignore unknown error', () => {
    const errors = findKnownErrors([
      {
        message: 'test',
        extensions: {
          // no error code
          // code: 42,
        },
      },
    ])
    expect(errors).toEqual([])
  })
})

describe('reportKnownErrors', () => {
  it('should report known error', () => {
    const store = useKnownAPIErrorsStore()
    reportKnownErrors(
      [
        new GraphQLError('test', {
          extensions: {
            code: 42,
          },
        }),
      ],
      { operationName: 'operation' },
    )

    expect(store.pushError).toBeCalledWith({
      message: 'test',
      code: 42,
      operationName: 'operation',
    })
  })

  it('should ignore unknown error', () => {
    const store = useKnownAPIErrorsStore()
    reportKnownErrors(
      [
        new GraphQLError('test', {
          extensions: {
            // no error code
            // code: 42,
          },
        }),
      ],
      { operationName: 'operation' },
    )

    expect(store.pushError).not.toBeCalled()
  })

  it('can handle empty input', () => {
    const store = useKnownAPIErrorsStore()

    expect(() => reportKnownErrors([], { operationName: 'operation' })).not.toThrow()
    expect(store.pushError).not.toBeCalled()

    expect(() => reportKnownErrors(undefined, { operationName: 'operation' })).not.toThrow()
    expect(store.pushError).not.toBeCalled()
  })
})
