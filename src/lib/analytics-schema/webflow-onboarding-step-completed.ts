import { z } from 'zod'
import { defineComplexTrackEvent } from './_define'

const collection = z.enum(['blog', 'author', 'tag', 'desk'])

export type Collection = z.infer<typeof collection>

export const webflowOnboardingStepCompleted = defineComplexTrackEvent({
  event: 'webflow_onboarding_step_completed',
  properties: z.discriminatedUnion('step_name', [
    z.object({
      step_name: z.literal('connect'),
    }),
    z.object({
      step_name: z.literal('site_select'),
      is_skipped: z.boolean(),
    }),
    z.object({
      step_name: z.literal('collection_mapping'),
      mapping_collections: z.array(collection),
      mapping_count: z.number(),
      // Is the step skipped?
      is_skipped: z.boolean(),
    }),
    z.object({
      step_name: z.literal('field_mapping'),
      mapping_collection: collection.nullable(),
      is_skipped: z.boolean(),
    }),
    z.object({
      step_name: z.literal('onboard_completed'),
    }),
  ]),
})
