// @ts-expect-error not module
import type {} from 'user-agent-data-types'
import { Axiom } from '@axiomhq/js'
import type { Encoder } from 'lib0/encoding'
import { toUint8Array } from 'lib0/encoding'
import type { Decoder } from 'lib0/decoding'
import { createDecoder, readVarString, readVarUint, readVarUint8Array } from 'lib0/decoding'
import { nanoid } from 'nanoid'
import { captureException } from '@sentry/vue'
import { MessageType } from '@hocuspocus/provider'
import { decodeUpdate } from 'yjs'
import { match } from 'ts-pattern'
import { env } from '~/env'

export const instanceId = nanoid()

const axiom = new Axiom({
  token: env.VITE_AXIOM_TOKEN,
})

interface Message {
  type?: unknown
  encoder: Encoder
}

enum SyncMessageType {
  Step1 = 'step1',
  Step2 = 'step2',
  Update = 'update',
}

export function sendLog({
  userId,
  articleId,
  clientId,
  message,
}: {
  userId: string
  articleId: string
  clientId: string
  message: Message
}) {
  const data = toUint8Array(structuredClone(message.encoder))
  try {
    const extraLogs = match(message.type)
      .with(MessageType.Sync, () => readSyncMessage(data.slice(1)))
      .with(MessageType.Stateless, () => readStatelessMessage(data.slice(1)))
      .otherwise(() => ({}))

    axiom.ingest('editor_edits', {
      from: 'client',
      user_id: userId,
      article_id: articleId,
      client_id: clientId,
      instance_id: instanceId,
      message_type: message.type,
      data: Array.from(data),
      user_agent: navigator.userAgent,
      brands: navigator.userAgentData?.brands,
      platform: navigator.userAgentData?.platform,
      mobile: navigator.userAgentData?.mobile,
      ...extraLogs,
    })
  } catch (e) {
    captureException(e, (scope) => {
      scope.setContext('message', {
        instance_id: instanceId,
        message: message.type,
        data: Array.from(data),
      })
      return scope
    })
  }
}

const messageStep1 = 0
const messageStep2 = 1
const messageUpdate = 2

// https://github.com/yjs/y-protocols/blob/master/sync.js
function readSyncMessage(data: Uint8Array) {
  const decoder = createDecoder(data)
  const msgType = readVarUint(decoder)
  switch (msgType) {
    case messageStep1:
      return { sync_type: SyncMessageType.Step1 }
    case messageStep2:
      return { sync_type: SyncMessageType.Step2, ...readUpdate(decoder) }
    case messageUpdate:
      return { sync_type: SyncMessageType.Update, ...readUpdate(decoder) }
    default:
      return { sync_type: 'unknown' }
  }
}

function readUpdate(decoder: Decoder) {
  const update = decodeUpdate(readVarUint8Array(decoder))
  return {
    structs: update.structs,
    ds: {
      clients: Array.from(update.ds.clients.entries()),
    },
  }
}

// https://github.com/ueberdosis/hocuspocus/blob/main/packages/provider/src/OutgoingMessages/StatelessMessage.ts#L13
function readStatelessMessage(data: Uint8Array) {
  const decoder = createDecoder(data)
  return {
    message: readVarString(decoder),
  }
}
