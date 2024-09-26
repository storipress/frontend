interface Event extends Record<string, unknown> {
  kind: string
}

export const events: Event[] = []

export function addEvent(event: Event) {
  events.push({
    ...event,
    timestamp: Date.now(),
  })
}

export function getEvents(): Event[] {
  return events
}
