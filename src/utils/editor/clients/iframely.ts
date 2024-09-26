import '@iframely/embed.js'

import ky from 'ky'

import type { IFramely } from './iframely-types'

export * from './iframely-types'

export const IFRAMELY_OPTIONS = {
  iframe: '1',
  omit_script: '1',
  html5: '1',
  lazy: '1',
}

export const IGNORE_IFRAME_DOMAINS = new Set(['open.spotify.com', 'music.apple.com'])

const client = ky.create({
  searchParams: IFRAMELY_OPTIONS,
})

const ENDPOINT = 'https://cdn.iframe.ly/api/iframely'

export type IframelyClient = ReturnType<typeof createIframelyClient>

interface OEmbedOptions {
  url: string
  params?: Record<string, string>
}

export function createIframelyClient(key: string) {
  return {
    oEmbed({ url, params = {} }: OEmbedOptions): Promise<IFramely> {
      return client.get(ENDPOINT, { searchParams: { ...params, key, url } }).json()
    },
  }
}
