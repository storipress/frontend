import type { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TableOfContentView from './view.vue'
import { TableOfContentSchema } from './schema'

export function attachTableOfContentNodeView(node: Node): Node<unknown> {
  return node?.extend({
    addNodeView() {
      return VueNodeViewRenderer(TableOfContentView)
    },
  })
}

export const TableOfContent = attachTableOfContentNodeView(TableOfContentSchema)
