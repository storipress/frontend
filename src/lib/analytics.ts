import { AnalyticsBrowser } from '@segment/analytics-next'
import { mapKeys, pickBy } from 'lodash-es'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { CoreExtraContext } from '@segment/analytics-core'
import { z } from 'zod'
import { exclude } from 'tsafe'
import { addBreadcrumb } from '@sentry/vue'
import { useClientID } from './client-id'
import { type TrackEvent, trackEventSchema } from './analytics-schema'
import { getOpenReplay } from './vendors/openreplay'
import { env } from '~/env'

export const analytics = new AnalyticsBrowser()

if (env.VITE_SEGMENT_WRITE_KEY) {
  analytics.load({
    writeKey: env.VITE_SEGMENT_WRITE_KEY,
  })
}

let campaign: CoreExtraContext['campaign']

const utmSchema = z
  .record(
    // schema to transform array of string to string by join with ,
    z.union([z.string(), z.array(z.string()), z.null()]).transform((value) => {
      if (Array.isArray(value)) {
        return value.filter(exclude([null])).join(',')
      }
      return value ?? ''
    }),
  )
  .transform((records) => {
    return mapKeys(records, (_val, key) => {
      const newKey = key.toLowerCase().replace(/^utm_/, '')
      // segment use `name` for `utm_campaign`
      if (newKey === 'campaign') {
        return 'name'
      }
      return newKey
    })
  })

export function setUTM(route: RouteLocationNormalizedLoaded) {
  const utm = normalizeUTM(route.query)
  campaign = utm
}

export function getUTM() {
  return campaign
}

export function normalizeUTM(
  query: Record<string, null | string | (string | null)[]>,
): CoreExtraContext['campaign'] | undefined {
  const utm = pickBy(query, (_val, key) => key.startsWith('utm_'))
  if (Object.keys(utm).length === 0) {
    return undefined
  }

  const res = utmSchema.safeParse(utm)
  return res.success ? (res.data as CoreExtraContext['campaign']) : undefined
}

export function sendIdentify(id: string, traits: Record<string, any>) {
  analytics.identify(id, traits, getTrackContext())
}

export function sendPage(route: RouteLocationNormalizedLoaded) {
  analytics.page({}, getTrackContext(route))
}

// skipcq: JS-0323
export function sendTrackUnchecked(event: string, properties: Record<string, any> = {}, openReplayTrack = false) {
  getOpenReplay()?.event(event, properties, openReplayTrack)
  addBreadcrumb({
    category: 'track',
    level: 'info',
    message: event,
    data: properties,
  })
  analytics.track(
    event,
    {
      ...properties,
    },
    getTrackContext(),
  )
}

type ExtractProperties<EventName extends TrackEvent['event']> = Extract<TrackEvent, { event: EventName }>['properties']

export function sendTrack<
  EventName extends TrackEvent['event'],
  Properties extends ExtractProperties<EventName> = ExtractProperties<EventName>,
>(event: EventName, properties?: Properties): void {
  if (env.DEV) {
    try {
      trackEventSchema.parse({ event, properties })
    } catch (error) {
      console.error(error)
    }
  }
  sendTrackUnchecked(event, properties)
}

analytics.addSourceMiddleware(({ payload, next }) => {
  const event = payload.obj
  event.context ??= {}
  event.context.app = {
    name: 'manager-next',
    version: env.VITE_APP_VERSION,
  }
  next(payload)
})

export function getTrackContext(route?: RouteLocationNormalizedLoaded): CoreExtraContext {
  const clientID = useClientID(route)
  return pickBy(
    {
      groupId: clientID,
      campaign,
    } satisfies CoreExtraContext,
    (value) => value,
  )
}
