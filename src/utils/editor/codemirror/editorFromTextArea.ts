import { EditorView } from '@codemirror/view'
import type { Extension, Transaction } from '@codemirror/state'

export function editorFromTextArea(
  textarea: HTMLTextAreaElement,
  extensions: Extension[],
  dispatch?: ((tr: Transaction) => void) | undefined,
) {
  const view = new EditorView({ doc: textarea.value, extensions, dispatch })
  textarea?.parentNode?.insertBefore(view.dom, textarea)
  textarea.style.display = 'none'
  if (textarea.form)
    textarea.form.addEventListener('submit', () => {
      textarea.value = view.state.doc.toString()
    })
  return view
}
