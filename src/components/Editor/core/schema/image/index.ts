import type { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import { stopEvent } from '../draggable-node'
import { clientID } from '../../client'
import { ImageSchema } from './schema'
import ImageView from './view.vue'
import { EXTERNAL_IMAGE } from '~/utils/image-source'

export { droppedItems } from './drop-bus'

export { ImageSchema }

export function attachImageNodeView(node: typeof ImageSchema): Node<unknown> {
  return node
    .extend({
      addNodeView() {
        return VueNodeViewRenderer(ImageView, {
          stopEvent,
        })
      },
    })
    .configure({
      pasteAttributes: {
        cid: clientID,
        provider: EXTERNAL_IMAGE,
      },
    })
}

export const Image = attachImageNodeView(ImageSchema)
