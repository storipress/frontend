import type { Context, MiddlewareHandler } from 'hono'
import { Toucan } from 'toucan-js'
import type { CloudflareEnvContext } from './cloudflare-env'

export interface SentryContext extends CloudflareEnvContext {
  Variables: CloudflareEnvContext['Variables'] & {
    sentry: Toucan
  }
}

export default async function createSentry(c: Context<SentryContext>) {
  const body = await c.req.json()

  const sentry = new Toucan({
    dsn: c.var.env.sentry_dsn,
    context: c.executionCtx,
    request: c.req.raw,
  })
  sentry.configureScope((scope) => {
    scope.setTag('session_id', body.session_id)
    scope.setTag('user_id', body.user_id)
    scope.setTag('client_id', getClientID(body?.context?.pathname))
    scope.setContext('Request Body', body)
  })

  return sentry
}

function getClientID(pathname = '') {
  return pathname.split('/')[1]
}

export const sentryMiddleware: MiddlewareHandler<SentryContext> = async (c, next) => {
  c.set('sentry', await createSentry(c))
  await next()
}
