import { type Endpoint, type Remote, expose, wrap } from 'comlink'
import { nanoid } from 'nanoid'
import invariant from 'tiny-invariant'

export type { Remote }

export const channelId = nanoid()

const channelPrefix = 'stroipress-sync-'
let remote: Remote<any>
let connecting: Promise<void>
const remoteAPI: Record<string, unknown> = {}

const REQUEST_CHANNEL = '@@storipress-sync-request'
const RESPONSE_CHANNEL = '@@storipress-sync-response'

export async function connectToChannel<API>(api: API): Promise<Remote<API> | null> {
  Object.assign(remoteAPI, api)

  if (typeof window === 'undefined') return null

  if (!remote) {
    if (typeof BroadcastChannel !== 'undefined') connectWithBroadcastChannel()
    else await (connecting ??= connectWithMessageChannel())
  }

  return remote as any
}

function connectWithMessageChannel<API>() {
  if (isHost()) {
    const channel = new MessageChannel()

    const handleEvent = (event: MessageEvent) => {
      if (event.origin === location.origin && event.data === REQUEST_CHANNEL) {
        ;(event.source?.postMessage as (msg: any, origin: string, transferable: Transferable[]) => void)(
          RESPONSE_CHANNEL,
          event.origin,
          [channel.port2],
        )
        window.removeEventListener('message', handleEvent)
      }
    }
    window.addEventListener('message', handleEvent)
    const ep = channel.port1
    exposeAPI(ep)
    remote = wrap<API>(ep)
    return Promise.resolve()
  }

  if (process.env.NODE_ENV !== 'production') invariant(!hasForceClient(), 'message channel not support force client')

  return new Promise<void>((resolve) => {
    const handleEvent = (event: MessageEvent) => {
      if (event.origin === location.origin && event.data === RESPONSE_CHANNEL) {
        const ep = event.ports[0]
        exposeAPI(ep)
        remote = wrap<API>(ep)
        resolve()
      }
      window.removeEventListener('message', handleEvent)
    }
    invariant(window.top, 'we are not in iframe')
    window.addEventListener('message', handleEvent)
    window.top.postMessage(REQUEST_CHANNEL, location.origin)
  })
}

function connectWithBroadcastChannel<API>() {
  const id = getChannelID()
  if (!id) return null

  const channel = new BroadcastChannel(`${channelPrefix}${id}`)
  exposeAPI(channel)
  remote = wrap<API>(channel)
}

export function getChannelID(): string | null {
  return isHost() ? channelId : new URL(window.location.toString()).searchParams.get('channel')
}

export function isHost(): boolean {
  let forceClient = false
  if (process.env.NODE_ENV !== 'production') forceClient = hasForceClient()

  if (typeof window === 'undefined') return true

  return window.parent === window && !forceClient
}

function hasForceClient() {
  return new URL(window.location.toString()).searchParams.has('force-client')
}

function exposeAPI(ep: Endpoint) {
  expose(remoteAPI, ep)
}
