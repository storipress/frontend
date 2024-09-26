import { P, match } from 'ts-pattern'

// Backend could use empty array or undefined to indicate no data
export function isIntegrationConnectedWithData(data: unknown) {
  return match(data)
    .with([], () => false)
    .with(P.nullish, () => false)
    .otherwise((x) => {
      // x is object so we can use Object.keys
      if (typeof x === 'object' && x !== null) {
        return Object.keys(x).length > 0
      }

      // as here is impossible to be empty array or nullish, we can safely return true
      return true
    })
}
