import type { ResourcePageContext } from './types'
import { env } from '~/env'

export const invalidContext: ResourcePageContext = env.DEV
  ? new Proxy({} as ResourcePageContext, {
      get(_obj, key) {
        console.error(`Forbid to access internal context object key ${String(key)} without using \`getResourceOption\``)
        throw new Error('accessing internal context')
      },
    })
  : ({ identity: 'invalid', prefix: '', resource: 'invalid' } as unknown as ResourcePageContext)
