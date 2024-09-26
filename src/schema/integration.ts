import { z } from 'zod'

export enum IntegrationsKey {
  HeaderFooterCode = 'code-injection',
  Facebook = 'facebook',
  Twitter = 'twitter',
  GoogleAnalytics = 'google-analytics',
  Disqus = 'disqus',
  Slack = 'slack',
  Zapier = 'zapier',
  GoogleAdsense = 'google-adsense',
  Mailchimp = 'mailchimp',
  Shopify = 'shopify',
  Webflow = 'webflow',
  LinkedIn = 'linkedin',
  WordPress = 'wordpress',
  Hubspot = 'hubspot',
}

export const IntegrationsKeySchema = z.nativeEnum(IntegrationsKey)

export type CodeInjection = z.infer<typeof CodeInjectionSchema>
export type Disqus = z.infer<typeof DisqusSchema>
export type GoogleAdsense = z.infer<typeof GoogleAdsenseSchema>
export type GoogleAnalytics = z.infer<typeof GoogleAnalyticsSchema>
export type Mailchimp = z.infer<typeof MailchimpSchema>
export type Slack = z.infer<typeof SlackSchema>
export type Facebook = z.infer<typeof FacebookSchema>
export type Twitter = z.infer<typeof TwitterSchema>
export type Shopify = z.infer<typeof ShopifySchema>

export type IntegrationsData = z.infer<typeof IntegrationsDataSchema>
export type IntegrationsDataFromApi = z.input<typeof IntegrationsDataSchema>

const EmptyDataSchema = z.array(z.never()).nullish()

const SlackSchema = z.object({
  id: z.string(),
  name: z.string(),
  thumbnail: z.string(),
  published: z.array(z.string()).default([]),
  stage: z.array(z.string()).default([]),
  notifyAuthors: z.boolean(),
})

const MailchimpSchema = z.object({
  action: z
    .string()
    .nullable()
    .transform((value) => value ?? '')
    .default(''),
})

const GoogleAnalyticsSchema = z.object({
  anonymous: z.boolean(),
  tracking_id: z
    .string()
    .nullable()
    .transform((value) => value ?? '')
    .default(''),
})

const ScopesSchema = z.object({
  articles: z.boolean().default(false),
  'front-page': z.boolean().default(false),
})

const GoogleAdsenseSchema = z.object({
  code: z
    .string()
    .nullable()
    .transform((value) => value ?? '')
    .default(''),
  scopes: ScopesSchema,
  'ads.txt': z.string().nullable(),
})

const DisqusSchema = z.object({
  shortname: z
    .string()
    .nullable()
    .transform((value) => value ?? '')
    .default(''),
})

const CodeInjectionSchema = z.object({
  footer: z
    .string()
    .nullable()
    .transform((value) => value ?? '')
    .default(''),
  header: z
    .string()
    .nullable()
    .transform((value) => value ?? '')
    .default(''),
})

const FacebookSchema = z.array(
  z.object({
    page_id: z.string(),
    name: z.string(),
    thumbnail: z.string(),
  }),
)

const TwitterSchema = z.array(
  z.object({
    user_id: z.string(),
    name: z.string(),
    thumbnail: z.string(),
  }),
)

const ShopifySchema = z.object({
  id: z.number(),
  name: z.string(),
  domain: z.string(),
  myshopify_domain: z.string(),
  prefix: z.string(),
  updated_at: z.string().optional(),
  sync_customers: z.boolean().optional(),
  first_setup_done: z.boolean().optional(),
  title: z.string().optional(),
})

const LinkedInSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  thumbnail: z.string().nullable(),
  authors: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      thumbnail: z.string().nullable(),
    }),
  ),
})

const DataSchema = z.object({
  [IntegrationsKey.HeaderFooterCode]: CodeInjectionSchema,
  [IntegrationsKey.Disqus]: DisqusSchema,
  [IntegrationsKey.GoogleAdsense]: GoogleAdsenseSchema,
  [IntegrationsKey.GoogleAnalytics]: GoogleAnalyticsSchema,
  [IntegrationsKey.Mailchimp]: MailchimpSchema,
  [IntegrationsKey.Zapier]: EmptyDataSchema,
  [IntegrationsKey.Webflow]: EmptyDataSchema,
  [IntegrationsKey.WordPress]: EmptyDataSchema,
})

const ThirdPartyDataSchema = z.object({
  [IntegrationsKey.Facebook]: FacebookSchema,
  [IntegrationsKey.Shopify]: ShopifySchema,
  [IntegrationsKey.Slack]: SlackSchema,
  [IntegrationsKey.Twitter]: TwitterSchema,
  [IntegrationsKey.LinkedIn]: LinkedInSchema,
})

const ThirdPartyDataFromApiSchema = z.object({
  [IntegrationsKey.Facebook]: z.union([FacebookSchema, EmptyDataSchema]),
  [IntegrationsKey.Shopify]: z.union([ShopifySchema, EmptyDataSchema]),
  [IntegrationsKey.Slack]: z.union([SlackSchema, EmptyDataSchema]),
  [IntegrationsKey.Twitter]: z.union([TwitterSchema, EmptyDataSchema]),
  [IntegrationsKey.LinkedIn]: z.union([LinkedInSchema, EmptyDataSchema]),
})

export const IntegrationsDataSchema = DataSchema.merge(ThirdPartyDataSchema)

export const IntegrationsDataFromApiSchema = DataSchema.merge(ThirdPartyDataFromApiSchema)

export const IntegrationTraceKeySchema = z.enum([
  'facebook',
  'custom_code',
  'twitter',
  'google-analytics',
  'disqus',
  'slack',
  'zapier',
  'google_adsense',
  'mailchimp',
  'shopify',
  'webflow',
  'linkedin',
  'wordpress',
  'hubspot',
])

export type IntegrationTraceKey = z.infer<typeof IntegrationTraceKeySchema>

export const IntegrationSourceSchema = z.enum(['editor', 'settings', 'prophet'])

export type IntegrationSource = z.infer<typeof IntegrationSourceSchema>

const traceKeyMap: Partial<Record<IntegrationsKey, string>> = {
  'code-injection': 'custom_code',
  'google-analytics': 'google_analytics',
  'google-adsense': 'google_adsense',
}

export function integrationToTraceKey(key: IntegrationsKey): IntegrationTraceKey {
  const traceKey = traceKeyMap[key] || key

  if (import.meta.env.DEV) {
    IntegrationTraceKeySchema.parse(traceKey)
  }

  return traceKey as IntegrationTraceKey
}
