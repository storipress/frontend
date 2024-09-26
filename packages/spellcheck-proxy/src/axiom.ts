import type { Context } from 'hono'
import { AxiomWithoutBatching } from '@axiomhq/js'
import type { SentryContext } from './middlewares/sentry'

export default function createAxiom(c: Context<SentryContext>) {
  const axiom = new AxiomWithoutBatching({
    token: c.var.env.axiom_token,
  })

  const requestHeaders: Record<string, string> = {}
  c.req.raw.headers.forEach((val, key) => (requestHeaders[key] = val))

  const accessLog = {
    ip: c.req.raw.headers.get('cf-connecting-ip') ?? 'localhost',
    header: requestHeaders,
  }

  let _log = {
    ...accessLog,
    source: 'sapling',
    type: 'info' as 'error' | 'info',
    response_code: null as number | null,
    response_time: null as number | null,
    interval: null as number | null,
  }
  type Log = Partial<typeof _log>

  return {
    updateLog(log: Log) {
      _log = {
        ..._log,
        ...log,
      }
    },
    async sendLog(log: Log = {}) {
      try {
        await axiom.ingest(c.var.env.axiom_dataset, {
          ..._log,
          ...log,
        })
      } catch (error) {
        c.var.sentry.captureException(error)
      }
    },
  }
}
