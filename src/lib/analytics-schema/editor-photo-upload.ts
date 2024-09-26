import { z } from 'zod'
import { defineTrackEvent } from './_define'

export const editorPhotoUpload = defineTrackEvent({
  event: 'editor_photo_upload',
  properties: {
    type: z.enum(['drag', 'paste', 'upload']),
    isHotLink: z.boolean(),
  },
})
