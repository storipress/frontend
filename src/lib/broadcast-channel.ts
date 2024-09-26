export async function getBroadcastChannel(message: string) {
  if (typeof window.BroadcastChannel === 'undefined') {
    const { BroadcastChannel } = await import('broadcast-channel')
    return new BroadcastChannel(message)
  } else {
    return new BroadcastChannel(message)
  }
}
