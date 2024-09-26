import { z } from 'zod'
import { defineTrackEvent } from './_define'

export const editorSessionStart = defineTrackEvent({
  event: 'editor_session_start',
  properties: {
    article_id: z.string(),
    instance_id: z.string(),
  },
})
