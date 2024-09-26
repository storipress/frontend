import type { ServerError } from '@apollo/client/core'
import { throwServerError } from '@apollo/client/core'
import { errorMessage, handleSeverErrors } from '../error-handler'
import { mockAxiomIngest } from '~/test-helpers'

// skipcq: JS-0045
function createServerError(response: Response, result: unknown): ServerError {
  try {
    throwServerError(response, result, 'Server Error')
  } catch (error) {
    return error as ServerError
  }
}

beforeEach(() => {
  mockAxiomIngest.mockClear()
})

it('can handle not found error', async () => {
  await handleSeverErrors({
    statusCode: 404,
    error: createServerError(new Response('Not found', { status: 404 }), { message: 'Not found' }),
    operation: {
      operationName: 'GetSite',
      variables: {},
    },
    clientID: 'client_id',
  })

  expect(mockAxiomIngest).not.toBeCalled()
  expect(errorMessage.value).toMatchInlineSnapshot(
    `"We could not find data associated with this account. This account or publication was likely deleted."`,
  )
})

it('can handle bad request error', async () => {
  await handleSeverErrors({
    statusCode: 400,
    error: createServerError(new Response('Bad Request', { status: 400 }), { message: 'Bad Request' }),
    operation: {
      operationName: 'GetSite',
      variables: {},
    },
    clientID: 'client_id',
  })

  expect(mockAxiomIngest).toHaveBeenCalledTimes(1)
  expect(errorMessage.value).toMatchInlineSnapshot(
    `"An unknown error occurred. We have been notified, please back up any unsaved data."`,
  )
})

it('can handle internal error', async () => {
  await handleSeverErrors({
    statusCode: 500,
    error: createServerError(new Response('Internal error', { status: 500 }), { message: 'Internal error' }),
    operation: {
      operationName: 'GetSite',
      variables: {},
    },
    clientID: 'client_id',
  })

  expect(mockAxiomIngest).not.toBeCalled()
  expect(errorMessage.value).toMatchInlineSnapshot(
    `"An unknown error occurred. We have been notified, please back up any unsaved data."`,
  )
})
