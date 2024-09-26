import { z } from 'zod'
import { defineTrackEvent } from './_define'

export const wordpressOnboardingStarted = defineTrackEvent({
  event: 'wordpress_onboarding_started',
  properties: {
    source: z.enum(['integration', 'onboarding']),
  },
})
