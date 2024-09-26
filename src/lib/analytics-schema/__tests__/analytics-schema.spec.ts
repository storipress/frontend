import { expect, it } from 'vitest'
import { trackEventSchema } from '..'

it('can verify editor_hero_photo_added', () => {
  expect(trackEventSchema.safeParse({ event: 'editor_hero_photo_added', properties: { source: 'file' } }).success).toBe(
    true,
  )
})

it('will reject unknown event', () => {
  expect(trackEventSchema.safeParse({ event: 'unknown', properties: { source: 'file' } }).success).toBe(false)
})

it('has no duplicate events', () => {
  const eventNames = trackEventSchema.options.map((eventSchema) => eventSchema.shape.event.value)
  const dedupedEventNames = [...new Set(eventNames)]
  expect(dedupedEventNames.length).toBe(eventNames.length)
})
