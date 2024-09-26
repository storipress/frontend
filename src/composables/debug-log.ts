import { env } from '~/env'
import { __IS_DEV__ } from '~/lib/env'

export function useDebugLog(scope: string) {
  const color = `hsl(${stringHash(scope) % 360}, 100%, 50%)`

  return (...args: any[]) => {
    if (__IS_DEV__ || env.VITE_APP_DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`%c[${scope}]`, `color: ${color};`, ...args)
    }
  }
}

export function useDebugFn(defaultScope?: string) {
  return <T extends (...args: any[]) => any>(fn: T): T => {
    const debug = useDebugLog(fn.name || defaultScope || 'unknown')
    const wrapper = (...args: any[]): any => {
      debug('start', ...args)
      const result = fn(...args)
      debug('end', result)
      return result
    }

    return wrapper as T
  }
}

// from https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
function stringHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }
  return hash
}
