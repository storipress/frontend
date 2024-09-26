import type { Operation, ServerError } from '@apollo/client/core'
import { destr } from 'destr'
import { Axiom } from '@axiomhq/js'
import { env } from '~/env'

const axiom = new Axiom({
  token: env.VITE_AXIOM_API_ERROR_TOKEN,
})

const browserInfo = {
  user_agent: navigator.userAgent,
  brands: navigator.userAgentData?.brands,
  platform: navigator.userAgentData?.platform,
  mobile: navigator.userAgentData?.mobile,
}

export const errorMessage = ref()
export async function handleSeverErrors({
  statusCode,
  error,
  operation,
  clientID,
}: {
  statusCode: number
  error: ServerError
  operation: Pick<Operation, 'operationName' | 'variables'>
  clientID: string
}) {
  if (statusCode >= 401 && statusCode < 500) {
    errorMessage.value =
      'We could not find data associated with this account. This account or publication was likely deleted.'
  } else if (statusCode === 0 || (statusCode >= 500 && statusCode < 600) || statusCode === 400) {
    errorMessage.value = 'An unknown error occurred. We have been notified, please back up any unsaved data.'
  }

  if (statusCode === 400) {
    // HACK: Apollo will store response body in error.result, but it's undocumented
    const body = (error as { result?: Record<string, unknown> }).result ?? (await readResponse(error.response))
    axiom.ingest(env.VITE_AXIOM_API_ERROR_DATASET, {
      type: 'error',
      operation: {
        name: operation.operationName,
        variables: operation.variables,
      },
      source: 'manager',
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      body,
      ...browserInfo,
      client_id: clientID,
    })
  }
}

async function readResponse(response?: Response | null) {
  if (!response) {
    return null
  }
  const res = response.bodyUsed ? null : response.clone()
  if (!res) {
    return null
  }
  const text = await res.text()
  return destr(text)
}
