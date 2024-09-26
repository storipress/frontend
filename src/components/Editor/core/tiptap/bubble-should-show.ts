import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { isMarkActive, isNodeSelection, isTextSelection } from '@tiptap/core'

// modify from https://github.com/ueberdosis/tiptap/blob/main/packages/extension-bubble-menu/src/bubble-menu-plugin.ts
export function shouldShow({
  view,
  state,
  from,
  to,
}: {
  view: EditorView
  state: EditorState
  from: number
  to: number
}): boolean {
  if (!view.hasFocus()) {
    return false
  }

  // always show bubble menu for link
  if (isMarkActive(state, 'link')) {
    return true
  }

  const { doc, selection } = state
  const { empty } = selection

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection)
  const isNodeBLock = isNodeSelection(state.selection)

  if (empty || isEmptyTextBlock || isNodeBLock) {
    return false
  }

  return true
}
