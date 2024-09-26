import posthog from 'posthog-js'
import { env } from '~/env'

// we need this because we want another session replay
export function initPostHog() {
  if (env.VITE_POSTHOG_KEY) {
    posthog.init(env.VITE_POSTHOG_KEY, {
      api_host: 'https://us.i.posthog.com',

      // segment should take care of event capture
      autocapture: false,
      capture_pageleave: false,
      capture_pageview: false,
    })
  }
}
