import { z } from 'zod'
import { defineTrackEvent } from './_define'

const usedFeature = z.enum(['scheduler', 'first_feature'])

export const userMetaMergeFails = defineTrackEvent({
  event: 'user_meta_merge_fails',
  properties: {
    new_meta: z.object({
      hasEnteredWorkspaces: z.boolean().optional(),
      enterTimes: z.number().optional(),
      survey: z
        .object({
          business_purpose: z.string(),
          user_role: z.string(),
          publishing_frequency: z.string(),
          refer_source: z.string(),
        })
        .optional(),
      usedFeatures: z.array(usedFeature).optional(),
      lastSchedulerView: z.enum(['Month', '5 Day']).optional(),
    }),
  },
})
