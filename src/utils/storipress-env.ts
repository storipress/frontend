import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

// Split schema to prevent `import.meta` not available error in vite.config.ts
export const storipressEnvSchema = {
  VITE_API_HOST: z.string().url(),
  VITE_PUSHER_ENDPOINT: z.string(),
  VITE_EDITOR_ENDPOINT: z.string().url(),
  VITE_TYPESENSE_DOMAIN: z.string(),
  VITE_IFRAMELY_KEY: z.string(),
  VITE_STORIPRESS_DOMAIN: z.string(),
  VITE_STRIPE_PUBLISHABLEKEY: z.string(),
  VITE_FEATURES_ENDPOINT: z.string().url(),
  VITE_SENTRY_DSN: z.string().url(),
  VITE_SENTRY_ENV: z.string(),
  VITE_OPENREPLAY_PROJECT_ID: z.string(),
  VITE_SEGMENT_WRITE_KEY: z.string().optional(),
  VITE_INTERCOM_APP_ID: z.string().optional(),
  VITE_UPOLLO_API_KEY: z.string().optional(),
  VITE_TYPESENSE_KEY: z.string(),
  VITE_TYPESENSE_HOST: z.string(),
  VITE_GRAMMARLY_CLIENT_ID: z.string(),
  VITE_GPT: z.string().url(),
  VITE_LINKEDIN_CONVERSION_ID_SIGNUP: z.coerce.number().optional(),
  VITE_LINKEDIN_CONVERSION_ID_CHECKOUT: z.coerce.number().optional(),
  VITE_IMAGE_PROXY: z.string().url(),

  VITE_AXIOM_API_ERROR_DATASET: z.string(),
  VITE_AXIOM_API_ERROR_TOKEN: z.string(),

  VITE_APP_DEBUG: z
    .string()
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
  VITE_APP_VERSION: z.string(),
  VITE_ENABLE_MOCK_API: z
    .string()
    .optional()
    .transform((value) => value === 'true'),

  VITE_PUSHER_KEY: z.string(),

  VITE_AXIOM_TOKEN: z.string(),

  VITE_POSTHOG_KEY: z.string().optional(),
}

export function validEnv(runtimeEnv: Record<string, string | boolean | number | undefined>) {
  return createEnv({
    client: storipressEnvSchema,
    clientPrefix: 'VITE_',
    server: {},
    runtimeEnv,
  })
}
