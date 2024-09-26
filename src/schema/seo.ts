import { z } from 'zod'

export const SEOItemSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
})

export type SEOItem = z.infer<typeof SEOItemSchema>

export const SEOSchema = z.object({
  meta: SEOItemSchema,
  og: SEOItemSchema,
  ogImage: z.string().nullish(),
  hasSlug: z.boolean().nullish(),
})

export type SEO = z.infer<typeof SEOSchema>
