import ky from 'ky'
import type { IFramely } from '~/utils/editor/clients/iframely-types'

export interface TIFramelyProxy {
  iframe: string
  omit_script: string
  html5: string
  url: string
  card: string
  type: string
}

const client = ky.extend({
  body: null,
  headers: {},
})

const ENDPOINT = 'https://iframely-proxy.storipress.workers.dev'

export function createIframelyProxyClient() {
  const create = async (params: TIFramelyProxy, signature: string | undefined): Promise<IFramely> => {
    return await client
      .post(ENDPOINT, { body: JSON.stringify(params), headers: { 'iframely-signature': signature } })
      .json()
  }
  return {
    create,
  }
}
