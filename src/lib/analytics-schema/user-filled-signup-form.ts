import { z } from 'zod'
import { defineTrackEvent } from './_define'

export const userFilledSignupForm = defineTrackEvent({
  event: 'user_filled_signup_form',
  properties: {
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    publicationName: z.string(),
    isCompanyEmail: z.boolean(),
  },
})
