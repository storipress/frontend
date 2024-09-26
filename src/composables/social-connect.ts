import type { NotificationOptions } from '@storipress/core-component'
import type { BroadcastChannel as BroadcastChannelPolyfill } from 'broadcast-channel'
import type { MaybeRefOrGetter } from '@vueuse/core'
import { toValue } from '@vueuse/core'
import { z } from 'zod'
import { destr } from 'destr'
import { $URL } from 'ufo'
import { captureException } from '@sentry/vue'
import { noop } from 'lodash-es'
import { upperFirst } from 'scule'
import { useDebugLog } from './debug-log'
import { getBroadcastChannel } from '~/lib/broadcast-channel'

const responseSchema = z.union([
  z.object({
    ok: z.literal('1'),
  }),
  z.object({
    code: z.coerce.number(),
    message: z.string(),
  }),
  z.object({
    response: z.string(),
    // internal use for storing invalid response
    _raw: z.record(z.string().nullable()).optional(),
  }),
])

export type RawResponse = z.infer<typeof responseSchema>

export interface SuccessResponse {
  ok: true
}

export interface FailureResponse {
  ok: false
  code: number
  message: string
  _raw?: RawResponse
}

export type NormalizedResponse = SuccessResponse | FailureResponse

const DEFAULT_FAILURE_MESSAGE = 'unknown response'

interface UseSocialConnectOptions {
  width?: number
  height?: number
  polling?: boolean
}

export function useSocialConnect(
  url: MaybeRefOrGetter<string>,
  onSuccess: (data: SuccessResponse) => void = noop,
  onError: (error: FailureResponse) => void = (error) => {
    captureException(
      new Error(error.message === DEFAULT_FAILURE_MESSAGE ? 'unknown response for social-connected' : error.message),
      (scope) => {
        scope.setContext('response', error as unknown as Record<string, unknown>)
        return scope
      },
    )
  },
  { width = 500, height = 500, polling = false }: UseSocialConnectOptions = { width: 500, height: 500, polling: false },
) {
  let openedWindow: Window | null = null
  let channel: BroadcastChannel | BroadcastChannelPolyfill
  let closedByTimeout = false
  const log = useDebugLog('social-connect')

  // https://stackoverflow.com/questions/54034701/how-to-detect-window-close-event-that-was-opened-using-window-open
  function waitForClose(cb: () => void) {
    function poll() {
      if (!openedWindow) {
        return
      }

      if (openedWindow.closed && !closedByTimeout) {
        cb()
        openedWindow = null
        return
      }

      requestAnimationFrame(poll)
    }
    poll()
  }

  const openNewWindow = async () => {
    openedWindow = window.open(toValue(url), '_blank', `width=${width}, height=${height}`)

    if (polling) {
      waitForClose(() => {
        onSuccess({ ok: true })
      })
    }

    channel = await getBroadcastChannel('social_connected')
    log('start listing event')
    channel.onmessage = (event: MessageEvent) => {
      log('receiving event', event)
      const result = responseSchema.safeParse(event.data ?? event)
      if (result.success) {
        const response = normalizeResponse(result.data)
        if (response.ok) {
          onSuccess(response)
        } else {
          onError(response)
        }
      } else {
        captureException(new Error('received unexpected message for social-connected'), (scope) => {
          scope.setContext('event', { data: event.data })
          return scope
        })
        console.warn('event message error!!')
      }
      openedWindow = null
      channel.close()
    }
    setTimeout(
      () => {
        if (openedWindow && !openedWindow.closed) {
          log('timeout')
          closedByTimeout = true
          openedWindow.close()
          console.warn('connect timeout')
        }
        openedWindow = null
        channel.close()
      },
      1000 * 60 * 10,
    )
  }

  const closeChannel = () => {
    openedWindow = null
    log('channel close')
    channel?.close()
  }

  return {
    openNewWindow,
    closeChannel,
  }
}

const oldErrorResponse = z.object({ error: z.string() })

export function normalizeResponse(rawResponse: RawResponse): NormalizedResponse {
  if ('ok' in rawResponse) {
    return {
      ok: true,
    }
  }

  if ('code' in rawResponse) {
    return {
      ok: false,
      code: rawResponse.code,
      message: rawResponse.message,
    }
  }

  if ('response' in rawResponse) {
    if (rawResponse._raw) {
      captureException(new Error('unexpected raw response from social connected'), (scope) => {
        scope.setContext('rawResponse', rawResponse._raw as Record<string, string | null>)
        return scope
      })
    }
    const response = destr(rawResponse.response)
    if (Array.isArray(response) && response.length === 0) {
      return {
        ok: true,
      }
    }

    const parsed = oldErrorResponse.safeParse(response)

    if (parsed.success) {
      return {
        ok: false,
        code: -1,
        message: parsed.data.error,
      }
    }
  }

  return {
    ok: false,
    code: -1,
    message: DEFAULT_FAILURE_MESSAGE,
    _raw: rawResponse,
  }
}

export function parseResponse(url = new $URL(window.location.href)): RawResponse {
  const queries = {
    ok: url.searchParams.get('ok'),
    code: url.searchParams.get('code'),
    response: url.searchParams.get('response'),
    message: url.searchParams.get('message'),
  }

  const parsed = responseSchema.safeParse(queries)
  if (parsed.success) {
    return parsed.data
  }

  // If we unable to parse, just assume it's success
  return {
    response: '[]',
    _raw: queries,
  }
}

export function thirdPartyErrorMessage(key: 'twitter' | 'facebook' | 'linkedin' | 'hubspot'): NotificationOptions {
  return {
    title: `${upperFirst(key)} connection failed, please try again`,
    type: 'warning',
    iconName: 'warning',
    content: `If retrying fails, check app authorization in ${key} settings or contact us for assistance.`,
  }
}
