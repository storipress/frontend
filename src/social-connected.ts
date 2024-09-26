import { getBroadcastChannel } from '~/lib/broadcast-channel'
import { parseResponse } from '~/composables/social-connect'

export async function handleConnectedCallback() {
  const channel = await getBroadcastChannel('social_connected')
  const response = parseResponse()

  channel.postMessage(response)
  window.close()
}
