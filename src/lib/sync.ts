import invariant from 'tiny-invariant'
import type { PiniaPlugin, Store } from 'pinia'
import { noop } from 'lodash-es'

import type { Ref } from 'vue'
import { customRef, ref } from 'vue'
import { type Remote, channelId, connectToChannel, isHost } from './channel'
import { deserialize, serialize } from './serde'

export interface SyncOptions {
  enabled: true
  ignore?: string[]
}

export interface SyncStoreObject {
  store: Store<any>
  ignore: Set<string>
}

export interface SyncInfo {
  enabled: boolean
  type: 'host' | 'client'
  ready: boolean
  trigger: () => void
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    sync?: SyncOptions
  }

  export interface PiniaCustomProperties {
    $sync(): void
    $syncInfo: SyncInfo
    $syncing: Ref<boolean>
  }
}

export interface SyncAPI {
  setState(id: string, state: string): void
  childConnect(client: string, id: string): void
  initStore(state: { client: string; id: string; state: unknown }): void
}

let remote = null as unknown as Remote<SyncAPI>
const stores = new Map<string, SyncStoreObject>()
const needInit = new Map<string, string[]>()
const stateUpdating = new Map<string, boolean>()

function updateStore(id: string, serializedState: string) {
  const storeAndOptions = stores.get(id)
  invariant(storeAndOptions, `store ${id} not found`)
  const { store } = storeAndOptions
  stateUpdating.set(id, true)
  // just need shallow update
  Object.assign(store, deserialize(serializedState))
  stateUpdating.set(id, false)
  if (!store.$syncInfo.ready) {
    store.$syncInfo.ready = true
    store.$syncInfo.trigger()
  }
}

const api: SyncAPI = {
  childConnect(client: string, id: string) {
    const storeInfo = stores.get(id)
    if (!storeInfo) {
      const channels = needInit.get(id) || []
      needInit.set(id, [...channels, client])
      return
    }
    remote.initStore({ client, id, state: serialize(storeToObject(storeInfo)) })
  },

  initStore({ client, id, state }: { client: string; id: string; state: string }) {
    if (client !== channelId) return
    updateStore(id, state)
  },

  setState(id: string, payload: string) {
    updateStore(id, payload)
  },
}

export const sync: PiniaPlugin = ({ store, options }) => {
  const type = isHost() ? 'host' : 'client'
  if (!options.sync?.enabled) {
    return {
      $syncing: ref(true),
      $sync: () => {},
      $syncInfo: {
        enabled: false,
        type,
        ready: true,
        trigger: noop,
      },
    }
  }

  const storeInfo = { store, ignore: new Set(options.sync!.ignore) }

  startSync(storeInfo)

  let _trigger = noop
  const $syncing = customRef((track, trigger) => {
    _trigger = trigger

    return {
      get() {
        track()
        return store.$syncInfo.ready
      },
      set: noop,
    }
  })

  return {
    $sync: () => {
      remote.setState(store.$id, serialize(storeToObject(storeInfo)))
    },
    $syncing,
    $syncInfo: {
      enabled: true,
      type,
      ready: type === 'host',
      trigger: _trigger,
    },
  }
}

async function startSync(storeInfo: SyncStoreObject) {
  if (typeof window === 'undefined') return

  const { store } = storeInfo

  stores.set(store.$id, storeInfo)
  const isClient = !isHost()
  if (!remote) {
    const r = await connectToChannel<SyncAPI>(api)

    if (!r) {
      invariant(isClient, 'fail to create channel at host')
      return
    }
    remote = r
  }

  registerModule(store, remote)

  if (isClient) {
    remote.childConnect(channelId, store.$id)
  } else if (needInit.has(store.$id)) {
    const channels = needInit.get(store.$id) as string[]
    needInit.delete(store.$id)
    for (const client of channels) {
      remote.initStore({ client, id: store.$id, state: serialize(storeToObject(storeInfo)) })
    }
  }
}

function registerModule(store: Store<any>, remote: Remote<SyncAPI>) {
  store.$subscribe(
    () => {
      if (stateUpdating.get(store.$id)) return

      remote.setState(store.$id, serializeStore(store))
    },
    { flush: 'sync' },
  )
}

function serializeStore(store: Store<any>): string {
  const opt = stores.get(store.$id)
  if (!opt) return '{}'
  return serialize(storeToObject({ store, ignore: opt.ignore }))
}

function storeToObject({ store, ignore }: SyncStoreObject) {
  const obj: Record<string, unknown> = {}
  for (const key in store) {
    // in production build, store will have _p as Pinia class
    if (key === '$id' || key[0] === '_' || typeof (store as any)[key] === 'function') continue
    if (ignore.has(key)) continue
    obj[key] = (store as any)[key]
  }
  return obj
}
