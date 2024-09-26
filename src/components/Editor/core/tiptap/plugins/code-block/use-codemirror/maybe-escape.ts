import { Selection } from '@tiptap/pm/state'
import type { NodeViewProps } from '@tiptap/vue-3'
import type { EditorView as CodeMirror } from '@codemirror/view'
import type { Line, SelectionRange } from '@codemirror/state'

export function createMaybeEscape(
  props: Pick<NodeViewProps, 'editor' | 'node' | 'getPos'>,
  getCodeMirror: () => CodeMirror,
  options: { shouldScroll?: boolean } = { shouldScroll: true },
) {
  function maybeEscape(unit: 'line' | 'char', dir: number): boolean {
    const cm = getCodeMirror()
    const { state } = cm
    const { getPos, node, editor } = props
    let main: SelectionRange | Line = state.selection.main
    if (!main.empty) return false
    if (unit === 'line') main = state.doc.lineAt(main.head)
    if (dir < 0 ? main.from > 0 : main.to < state.doc.length) return false
    const targetPos = getPos() + (dir < 0 ? 0 : node.nodeSize)
    // if we will move to toplevel node, we don't do anything to ensure cursor is still visible
    // 0 -> toplevel node, editor.state.doc.nodeSize - 2 -> last child node
    if (targetPos === 0 || targetPos >= editor.state.doc.nodeSize - 2) {
      return false
    }
    const selection = Selection.near(editor.view.state.doc.resolve(targetPos), dir)
    const tr = editor.view.state.tr.setSelection(selection)
    if (options.shouldScroll) tr.scrollIntoView()
    editor.view.dispatch(tr)
    editor.view.focus()
    return true
  }

  return maybeEscape
}
