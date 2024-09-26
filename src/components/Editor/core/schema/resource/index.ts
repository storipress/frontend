import type { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import { setConfig } from '@storipress/tiptap-schema'
import { stopEvent } from '../draggable-node'
import { ResourceSchema } from './schema'
import ResourceView from './view.vue'

setConfig({
  embedRegex: [
    /youtube\.com\/watch/,
    /twitter\.com\/[^/]+\/status/,
    /instagram\.com\/p/,
    /vimeo\.com\/\d+/,
    /codepen\.io\/[^/]+\/pen/,
    /soundcloud\.com(?:\/[^/]+){2}/,
  ],
})

export { ResourceSchema }

export function attachResourceNodeView(node: Node<unknown>): Node<unknown> {
  return node.extend({
    addNodeView() {
      return VueNodeViewRenderer(ResourceView, { stopEvent })
    },
  })
}

export const Resource = attachResourceNodeView(ResourceSchema)
