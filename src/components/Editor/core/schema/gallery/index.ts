import type { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import { GallerySchema } from './schema'
import GalleryView from './view.vue'

export { GallerySchema }

export function attachGalleryNodeView(node: Node<unknown>): Node<unknown> {
  return node.extend({
    addNodeView() {
      return VueNodeViewRenderer(GalleryView, {
        stopEvent: ({ event }) => {
          if (event.type.startsWith('drag') || event.type === 'drop') {
            return true
          }
          return false
        },
      })
    },
  })
}

export const Gallery = attachGalleryNodeView(GallerySchema)
