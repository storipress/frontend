import type { KeyboardShortcutCommand, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Selection } from '@tiptap/pm/state'
import { EmbedSchema } from '@storipress/tiptap-schema'
import EmbedView from './view.vue'

export { EmbedSchema }

export function attachEmbedNodeView(node: Node<unknown>): Node<unknown> {
  return node.extend({
    addKeyboardShortcuts() {
      return {
        ArrowLeft: arrowHandler('left'),
        ArrowRight: arrowHandler('right'),
        ArrowUp: arrowHandler('up'),
        ArrowDown: arrowHandler('down'),
      }
    },

    addNodeView() {
      return VueNodeViewRenderer(EmbedView)
    },
  })
}

export const Embed = attachEmbedNodeView(EmbedSchema)

function arrowHandler(dir: 'left' | 'up' | 'right' | 'down'): KeyboardShortcutCommand {
  return ({ editor }) => {
    const { view, state, commands } = editor
    if (state.selection.empty && view.endOfTextblock(dir)) {
      const side = dir === 'left' || dir === 'up' ? -1 : 1
      const $head = state.selection.$head

      // https://storipress-media.atlassian.net/jira/software/projects/SPMVP/boards/1?selectedIssue=SPMVP-3929
      // Only above html block can trigger this error
      // We use `depth` here to check do we already at the toplevel node like `ResolvePos.prorotype.before` does
      // ref: https://github.com/ProseMirror/prosemirror-model/blob/9201015c268947c34fa31be26b8b7aa5a0cf9776/src/resolvedpos.ts#L80
      if ($head.depth === 0 && dir === 'up') {
        return false
      }

      const nextPos = Selection.near(state.doc.resolve(side > 0 ? $head.after() : $head.before()), side)
      if (nextPos.$head && nextPos.$head.parent.type.name === 'embed') {
        return commands.setTextSelection(nextPos)
      }
    }
    return false
  }
}
