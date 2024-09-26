import { z } from 'zod'
import { defineTrackEvent } from './_define'

export const editorHeroPhotoAdded = defineTrackEvent({
  event: 'editor_hero_photo_added',
  properties: {
    source: z.enum(['file', 'unsplash']),
  },
})
