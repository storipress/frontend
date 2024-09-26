import { createEnv } from '@t3-oss/env-core'
import type { MiddlewareHandler } from 'hono'
import { z } from 'zod'

const envSchema = z.object({
  axiom_dataset: z.string(),
  axiom_token: z.string(),
  sentry_dsn: z.string(),
  sapling_private_key: z.string(),
  bing_key: z.string(),
})

export interface CloudflareEnvContext {
  Bindings: Record<string, unknown>
  Variables: {
    env: z.infer<typeof envSchema>
  }
}

export const cloudflareEnvMiddleware: MiddlewareHandler<CloudflareEnvContext> = async (c, next) => {
  c.set(
    'env',
    createEnv({
      server: envSchema.shape,
      runtimeEnv: c.env as Record<string, string>,
    }),
  )
  await next()
}
