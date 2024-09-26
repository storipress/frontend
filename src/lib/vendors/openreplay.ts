import * as Sentry from '@sentry/vue'
import OpenReplay from '@openreplay/tracker'
import { env } from '~/env'
import { isIframe } from '~/utils'

const isDev = env.DEV

let tracker: OpenReplay
let isOpenReplaySessionStarted = false

export function initOpenReplay() {
  if (!isIframe && env.VITE_OPENREPLAY_PROJECT_ID) {
    tracker = new OpenReplay({
      projectKey: env.VITE_OPENREPLAY_PROJECT_ID,
      network: {
        failuresOnly: false,
        sessionTokenHeader: false,
        captureInIframes: true,
        ignoreHeaders: ['Cookie', 'Set-Cookie', 'Authorization'],
        capturePayload: true,
      },
      onStart: ({ sessionToken }) => {
        Sentry.setTag('openReplaySessionToken', sessionToken)
        Sentry.setTag('openReplaySessionURL', tracker.getSessionURL())
      },
    })
    tracker.setMetadata('app_version', env.VITE_APP_VERSION)
    if (!isDev) {
      tracker.start()
      isOpenReplaySessionStarted = true
    }
  }
}

export function startReplaySession() {
  if (!isOpenReplaySessionStarted && tracker) {
    tracker.start()
    isOpenReplaySessionStarted = true
  }
}

export function getOpenReplay(): OpenReplay | undefined {
  return tracker
}
