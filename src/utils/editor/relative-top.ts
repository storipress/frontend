import { posToDOMRect } from '@tiptap/core'
import type { EditorView } from 'prosemirror-view'

export function getRelativeTop(view: EditorView, from: number, to: number, parentRect: DOMRect): number {
  const rect = posToDOMRect(view, from, to)
  return rect.top - parentRect.top
}
