import * as Sentry from '@sentry/vue'
import type { RouteLocationNormalized } from 'vue-router'
import { updateAttributes } from './feature-flag'
import { getOpenReplay } from './vendors/openreplay'
import type { GetMeEmailQuery } from '~/graphql-operations'

export { sendLinkedInConvert } from './linkedin-track'

export { startReplaySession } from './vendors/openreplay'

declare global {
  interface Window {
    gr: Reditus
  }
}

type ReditusAction = 'track'
type ReditusArg = 'pageview' | 'conversion'

type Reditus = (action: ReditusAction, arg?: ReditusArg, traits?: Record<string, unknown> | string) => void

// Proxy reditus script to ensure calling the correct one
export function reditus(action: ReditusAction, arg?: ReditusArg, traits?: Record<string, unknown> | string): void
export function reditus(...args: Parameters<Reditus>): void {
  // Safety: we put a stub script in HTML to prevent this is undefined
  // Use ... to ensure passing same number of arguments as Reditus
  window.gr(...args)
}

export function setupIntegrations(me: GetMeEmailQuery['me'], clientID: string) {
  getOpenReplay()?.setUserID(me.email)
  sendIdentify(me.id, {
    name: me.full_name,
    email: me.email,
  })

  updateAttributes({
    id: me.id,
    email: me.email || '',
    clientID,
    loggedIn: true,
    signedUpSource: me.signed_up_source,
    role: me.role,
    url: window.location.pathname,
  })

  Sentry.setUser({
    id: me.id,
    email: me.email ?? undefined,
    role: me.role ?? undefined,
    clientID,
  })
}

export function trackPage(route: RouteLocationNormalized) {
  // Segment should automatically add properties
  sendPage(route)
  reditus('track', 'pageview')
  updateAttributes({
    url: route.path,
    clientID: route.params.clientID || '',
  })
}
