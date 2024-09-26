import type { Content } from '@tiptap/core'
import { Extension, getNodeType, isNodeSelection } from '@tiptap/core'
import type { NodeType } from 'prosemirror-model'
import { Fragment } from 'prosemirror-model'
import { findParentNodeOfType } from 'prosemirror-utils'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    extraCommands: {
      insertBlock: (content: Content) => ReturnType
      /**
       * Delete a node
       */
      delete: () => ReturnType

      /**
       * append content to the end of document
       */
      appendContent: (content: Content) => ReturnType

      /**
       * append block to the end of document
       */
      appendBlock: (typeOrName: string | NodeType) => ReturnType
    }
  }
}

export const ExtraCommands = Extension.create({
  name: 'extraCommands',

  addCommands() {
    return {
      insertBlock:
        (content: Content) =>
        ({ chain }) => {
          return chain()
            .insertContent(content)
            .command(({ tr, dispatch }) => {
              if (dispatch) {
                const { parent, pos } = tr.selection.$from
                const posAfter = pos + 1
                const nodeAfter = tr.doc.nodeAt(posAfter)

                // end of document
                if (!nodeAfter) {
                  const node = parent.type.contentMatch.defaultType?.create()

                  if (node) {
                    tr.insert(posAfter, node)
                  }
                }

                tr.scrollIntoView()
              }

              return true
            })
            .run()
        },

      appendContent:
        (content: Content) =>
        ({ commands, editor }) =>
          commands.insertContentAt(editor.state.doc.nodeSize - 2, content),

      appendBlock:
        (typeOrName: string | NodeType) =>
        ({ tr, state, dispatch }) => {
          const nodeType = getNodeType(typeOrName, state.schema)
          const childNode = nodeType.contentMatch.defaultType?.create()
          const node = nodeType.create(null, Fragment.fromArray(childNode ? [childNode] : []))

          if (dispatch) {
            dispatch(tr.insert(tr.doc.nodeSize - 2, node))
          }
          return true
        },

      delete:
        () =>
        ({ state, dispatch, tr }) => {
          const { selection, schema } = state
          if (isNodeSelection(selection)) {
            if (dispatch) {
              dispatch(tr.deleteSelection())
            }
            return true
          } else {
            // embed type is not a atom node
            const parent = findParentNodeOfType(schema.nodes.embed)(selection)
            if (parent) {
              if (dispatch) {
                dispatch(tr.deleteRange(parent.pos, parent.pos + parent.node.nodeSize))
              }
              return true
            }
          }
          return false
        },
    }
  },
})
