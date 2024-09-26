import { analytics } from './analytics'

declare global {
  interface Window {
    lintrk?: (action: string, traits?: Record<string, unknown>) => void
  }
}

export async function sendLinkedInConvert(conversionId?: number) {
  await analytics.ready()
  if (!window.lintrk || !conversionId) {
    return
  }
  window.lintrk('track', { conversion_id: conversionId })
}
