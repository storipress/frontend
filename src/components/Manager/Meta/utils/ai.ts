import ky from 'ky'
import * as Sentry from '@sentry/vue'
import pTimeout from 'p-timeout'
import type { GeneratingControllerKey } from './store'
import { useMetaStore } from './store'
import { env } from '~/env'
import { useAuthStore } from '~/stores/auth'
import { streamAsyncIterator } from '~/components/Editor/AIMenu/ask-ai'

const AI_ENDPOINT = env.VITE_GPT

export interface IResponse {
  value: string
  done: boolean
}

export function useAI() {
  const { clientID, token } = useAuthStore()
  const metaStore = useMetaStore()

  async function askAI(promptType: GeneratingControllerKey | string, generatedResponse: Ref<string>, content: string) {
    const postBody = {
      type: promptType,
      content,
      chat_uuid: undefined,
      client_id: clientID,
    }

    let postAsk
    try {
      postAsk = await ky.post(AI_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        json: postBody,
        timeout: false,
        signal: metaStore.generatingController[promptType as GeneratingControllerKey]?.signal,
      })
    } catch {
      return
    }

    const parseResponse = postAsk.body
    const reader = parseResponse?.getReader()
    if (!reader) return
    const response = streamAsyncIterator(reader, postAsk.status, (data) => data)

    let next = await pTimeout(response.next(), {
      milliseconds: 5000,
      fallback: () => {
        Sentry.captureException(new Error('gpt response time over 5 seconds'))
        return { value: '', done: true }
      },
    })

    try {
      // skipcq: JS-0003
      while (true) {
        if (next.done) {
          break
        }
        generatedResponse.value += next.value
        next = (await response.next()) as IResponse
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        Sentry.captureException(error)
      }
    }
  }

  return {
    askAI,
  }
}
