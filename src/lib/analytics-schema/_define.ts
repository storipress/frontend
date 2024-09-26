import { z } from 'zod'

interface DefineTrackEventInput<EventName extends string, Properties extends z.ZodRawShape> {
  event: EventName
  properties?: Properties
}

export function defineTrackEvent<EventName extends string, Properties extends z.ZodRawShape>(
  input: DefineTrackEventInput<EventName, Properties>,
): z.ZodObject<{
  event: z.ZodLiteral<EventName>
  properties: z.ZodObject<Properties> | z.ZodUndefined
}> {
  return defineComplexTrackEvent({
    event: input.event,
    properties: input.properties ? z.object(input.properties) : z.undefined(),
  })
}

interface DefineComplexTrackEventInput<EventName extends string, Properties extends z.ZodTypeAny> {
  event: EventName
  properties: Properties
}
export function defineComplexTrackEvent<EventName extends string, Properties extends z.ZodTypeAny>(
  input: DefineComplexTrackEventInput<EventName, Properties>,
): z.ZodObject<{
  event: z.ZodLiteral<EventName>
  properties: Properties
}> {
  return z.object({
    event: z.literal(input.event),
    properties: input.properties,
  })
}
