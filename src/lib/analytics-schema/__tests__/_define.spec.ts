import { expect, it } from 'vitest'
import { z } from 'zod'
import { defineTrackEvent } from '../_define'

it('can create event with properties', () => {
  const schema = defineTrackEvent({
    event: 'foo',
    properties: {
      bar: z.enum(['baz', 'qux']),
    },
  })

  expect(
    schema.safeParse({
      event: 'foo',
      properties: {
        bar: 'baz',
      },
    }).success,
  ).toBe(true)

  expect(
    schema.safeParse({
      event: 'unknown',
      properties: {
        bar: 'baz',
      },
    }).success,
  ).toBe(false)

  expect(
    schema.safeParse({
      event: 'foo',
      properties: {
        bar: 'unknown',
      },
    }).success,
  ).toBe(false)
})

it('can create event without properties', () => {
  const schema = defineTrackEvent({
    event: 'foo',
  })

  expect(
    schema.safeParse({
      event: 'foo',
    }).success,
  ).toBe(true)

  expect(
    schema.safeParse({
      event: 'foo',
      properties: {
        bar: 'baz',
      },
    }).success,
  ).toBe(false)
})
