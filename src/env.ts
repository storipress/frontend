import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import { storipressEnvSchema } from './utils/storipress-env'

export const env = createEnv({
  client: storipressEnvSchema,
  clientPrefix: 'VITE_',
  shared: {
    DEV: z.union([z.string(), z.boolean()]).transform((val) => (typeof val === 'boolean' ? val : Boolean(val))),
    MODE: z.enum([
      // Production build https://stori.press
      'production',
      // Staging build https://storipress.pro or https://release-vx-xx-xx.storipress-app.pages.dev
      'staging',
      // Development build https://storipress.dev or https://xxxxx.storipress-app.pages.dev
      'dev',
      // Local server http://localhost:3333
      'development',
      // Unit test
      'test',
    ]),
    BASE_URL: z.string(),
  },
  // Must use strict config as sentry plugin will conflict
  runtimeEnvStrict: {
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
    VITE_API_HOST: import.meta.env.VITE_API_HOST,
    VITE_APP_DEBUG: import.meta.env.VITE_APP_DEBUG,
    VITE_EDITOR_ENDPOINT: import.meta.env.VITE_EDITOR_ENDPOINT,
    VITE_ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API,
    VITE_FEATURES_ENDPOINT: import.meta.env.VITE_FEATURES_ENDPOINT,
    VITE_IFRAMELY_KEY: import.meta.env.VITE_IFRAMELY_KEY,
    VITE_INTERCOM_APP_ID: import.meta.env.VITE_INTERCOM_APP_ID,
    VITE_OPENREPLAY_PROJECT_ID: import.meta.env.VITE_OPENREPLAY_PROJECT_ID,
    VITE_PUSHER_ENDPOINT: import.meta.env.VITE_PUSHER_ENDPOINT,
    VITE_SEGMENT_WRITE_KEY: import.meta.env.VITE_SEGMENT_WRITE_KEY,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_SENTRY_ENV: import.meta.env.VITE_SENTRY_ENV,
    VITE_STORIPRESS_DOMAIN: import.meta.env.VITE_STORIPRESS_DOMAIN,
    VITE_STRIPE_PUBLISHABLEKEY: import.meta.env.VITE_STRIPE_PUBLISHABLEKEY,
    VITE_TYPESENSE_DOMAIN: import.meta.env.VITE_TYPESENSE_DOMAIN,
    VITE_TYPESENSE_HOST: import.meta.env.VITE_TYPESENSE_HOST,
    VITE_TYPESENSE_KEY: import.meta.env.VITE_TYPESENSE_KEY,
    VITE_UPOLLO_API_KEY: import.meta.env.VITE_UPOLLO_API_KEY,
    VITE_GRAMMARLY_CLIENT_ID: import.meta.env.VITE_GRAMMARLY_CLIENT_ID,
    VITE_GPT: import.meta.env.VITE_GPT,
    VITE_PUSHER_KEY: import.meta.env.VITE_PUSHER_KEY,
    VITE_LINKEDIN_CONVERSION_ID_SIGNUP: import.meta.env.VITE_LINKEDIN_CONVERSION_ID_SIGNUP,
    VITE_LINKEDIN_CONVERSION_ID_CHECKOUT: import.meta.env.VITE_LINKEDIN_CONVERSION_ID_CHECKOUT,
    VITE_AXIOM_TOKEN: import.meta.env.VITE_AXIOM_TOKEN,
    VITE_AXIOM_API_ERROR_DATASET: import.meta.env.VITE_AXIOM_API_ERROR_DATASET,
    VITE_AXIOM_API_ERROR_TOKEN: import.meta.env.VITE_AXIOM_API_ERROR_TOKEN,
    VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
    VITE_IMAGE_PROXY: import.meta.env.VITE_IMAGE_PROXY,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  },
})

/**
 * A boolean flag to know if we are running in development mode
 *
 * Use the name so we can easily find it in the code
 */
export const __IS_DEV__ = (env.DEV || env.MODE === 'dev') && env.MODE !== 'test'
export const __IS_PROD__ = env.MODE === 'production'
