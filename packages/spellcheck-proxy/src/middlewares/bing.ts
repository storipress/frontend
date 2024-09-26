import type { MiddlewareHandler } from 'hono'
import { createBingClient } from '../bing-client'
import type { CloudflareEnvContext } from './cloudflare-env'

export interface BingContext {
  Bindings: Record<string, unknown>
  Variables: CloudflareEnvContext['Variables'] & {
    bing: ReturnType<typeof createBingClient>
  }
}

export const bingMiddleware: MiddlewareHandler<BingContext> = async (c, next) => {
  c.set('bing', createBingClient(c.var.env.bing_key))
  await next()
}
