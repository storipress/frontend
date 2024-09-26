import { Hono } from 'hono'
import { FetchError, ofetch } from 'ofetch'
import { corsMiddleware } from './middlewares/cors'
import { cloudflareEnvMiddleware } from './middlewares/cloudflare-env'
import { sentryMiddleware } from './middlewares/sentry'
import createAxiom from './axiom'

const SAPLING_API_URL = 'https://api.sapling.ai'

export const sapling = new Hono()

sapling.use('/*', corsMiddleware)

sapling.options('/*', (c) => {
  c.header('Content-Type', 'application/json')
  c.status(200)
  return c.json({})
})

sapling.post('/*', cloudflareEnvMiddleware, sentryMiddleware, async (c) => {
  const req = c.req
  const body = await req.json()
  const requestTime = Number(req.raw.headers.get('request-start-time') ?? 0)

  const sentry = c.var.sentry
  const { updateLog, sendLog } = createAxiom(c)

  try {
    // remove the '/sapling/' prefix from the request path
    const requestPath = req.path.substring(8)
    // pass request path along to Sapling
    const requestUrl = `${SAPLING_API_URL}${requestPath}`
    const urlRes = await ofetch(requestUrl, {
      method: 'POST',
      body: {
        ...body,
        key: c.var.env.sapling_private_key,
      },
      onResponse({ response }) {
        const responseTime = Date.now()
        updateLog({
          response_code: response.status,
          response_time: responseTime,
          interval: responseTime - requestTime,
        })
      },
    })

    c.header('Content-Type', 'application/json')
    c.status(200)

    sendLog()
    return c.json(urlRes, 200, {
      'Content-Type': 'application/json',
    })
  } catch (error) {
    sendLog({ type: 'error' })
    if (error instanceof FetchError) {
      if (error.status === 400 || error.status === 429) {
        return c.text(error.message, error.status)
      }
    }
    sentry.captureException(error)
    return c.text('HTTP 500 Internal Server Error', 500)
  }
})
