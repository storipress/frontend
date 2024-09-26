import { z } from 'zod'

export const SpellcheckResponseSchema = z.object({
  _type: z.literal('SpellCheck'),
  flaggedTokens: z.array(
    z.object({
      offset: z.number(),
      type: z.string(),
      token: z.string(),
      suggestions: z.array(
        z.object({
          suggestion: z.string(),
          score: z.number(),
        }),
      ),
    }),
  ),
})

export type SpellcheckResponse = z.infer<typeof SpellcheckResponseSchema>
