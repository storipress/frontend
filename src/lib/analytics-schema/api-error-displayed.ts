import { z } from 'zod'
import { defineTrackEvent } from './_define'

export const apiErrorDisplayed = defineTrackEvent({
  event: 'api_error_displayed',
  properties: {
    code: z.number(),
    path: z.array(z.string()).optional(),
    operationName: z.string().optional(),
    message: z.string(),
  },
})
