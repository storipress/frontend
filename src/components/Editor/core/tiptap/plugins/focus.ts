// A fork version of https://github.com/ueberdosis/tiptap/blob/main/packages/extension-focus/src/focus.ts
// We don't care about focus or not because it will break our menu, also remove the mode as we only need the `all` mode

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export interface FocusOptions {
  className: string
}

export const FocusClasses = Extension.create<FocusOptions>({
  name: 'focus',

  addOptions() {
    return {
      className: 'has-focus',
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('focus'),
        props: {
          decorations: ({ doc, selection }) => {
            const { isEditable } = this.editor
            const { anchor } = selection
            const decorations: Decoration[] = []

            if (!isEditable) {
              return DecorationSet.empty
            }

            doc.descendants((node, pos) => {
              if (node.isText) {
                return false
              }

              const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1
              if (!isCurrent) {
                return false
              }

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: this.options.className,
                }),
              )
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
