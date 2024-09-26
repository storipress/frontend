import { exitCode } from '@tiptap/pm/commands'
import type { Node } from '@tiptap/pm/model'
import { Fragment } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import type { NodeViewProps } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import type { EditorView as CodeMirror, KeyBinding } from '@codemirror/view'
import type { Extension } from '@codemirror/state'
import invariant from 'tiny-invariant'
import { createMaybeEscape } from './maybe-escape'
import { editorFromTextArea } from '~/utils/editor/codemirror'

export function useCodeMirror({
  props,
  getExtensions,
}: {
  props: Pick<NodeViewProps, 'editor' | 'getPos' | 'node'>
  getExtensions: (keyMaps: KeyBinding[]) => Extension[]
}) {
  const cm = shallowRef<CodeMirror>()
  let updating = false
  const target = ref<HTMLTextAreaElement>()

  function getCodeMirror() {
    invariant(cm.value, 'CodeMirror is not initialized')
    return cm.value
  }

  const maybeEscape = createMaybeEscape(props, getCodeMirror)

  function codeMirrorKeyMap(): KeyBinding[] {
    const editor = props.editor
    return [
      { key: 'ArrowUp', run: () => maybeEscape('line', -1) },
      { key: 'ArrowLeft', run: () => maybeEscape('char', -1) },
      { key: 'ArrowDown', run: () => maybeEscape('line', 1) },
      { key: 'ArrowRight', run: () => maybeEscape('char', 1) },
      {
        key: 'Ctrl-z',
        mac: 'Cmd-z',
        run: () => {
          editor.commands.undo()
          return true
        },
      },
      {
        key: 'Shift-Ctrl-z',
        mac: 'Shift-Cmd-z',
        run: () => {
          editor.commands.redo()
          return true
        },
      },
      {
        key: 'Ctrl-Y',
        mac: 'Cmd-y',
        run: () => {
          editor.commands.redo()
          return true
        },
      },
      {
        key: 'Ctrl-Enter',
        run: () => {
          if (exitCode(editor.view.state, editor.view.dispatch)) editor.view.focus()
          return true
        },
      },
    ]
  }

  function computeChange(oldVal: string, newVal: string) {
    if (oldVal === newVal) return null
    let start = 0
    let oldEnd = oldVal.length
    let newEnd = newVal.length
    while (start < oldEnd && oldVal.charCodeAt(start) === newVal.charCodeAt(start)) start += 1
    while (oldEnd > start && newEnd > start && oldVal.charCodeAt(oldEnd - 1) === newVal.charCodeAt(newEnd - 1)) {
      oldEnd -= 1
      newEnd -= 1
    }
    return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) }
  }

  function valueChanged(textUpdate: string, node: Node, getPos: (() => number) | boolean, view: Editor['view']) {
    const change = computeChange(node.textContent, textUpdate)
    if (change && typeof getPos === 'function') {
      const start = getPos() + 1

      const pmTr = view.state.tr.replaceWith(
        start + change.from,
        start + change.to,
        // use view.state.schema.text('') will have error
        change.text ? view.state.schema.text(change.text) : Fragment.empty,
      )
      view.dispatch(pmTr)
    }
  }

  function asProseMirrorSelection(pmDoc: Node, cmView: CodeMirror, getPos: (() => number) | boolean) {
    const offset = (typeof getPos === 'function' ? getPos() ?? 0 : 0) + 1
    const anchor = cmView.state.selection.main.from + offset
    const head = cmView.state.selection.main.to + offset
    return TextSelection.create(pmDoc, anchor, head)
  }

  function forwardSelection(cmView: CodeMirror, pmView: Editor['view'], getPos: (() => number) | boolean) {
    if (!cmView.hasFocus) return
    const selection = asProseMirrorSelection(pmView.state.doc, cmView, getPos)
    if (!selection.eq(pmView.state.selection)) pmView.dispatch(pmView.state.tr.setSelection(selection))
  }

  function createCodeMirror(extensions: Extension[]) {
    return editorFromTextArea(target.value as HTMLTextAreaElement, extensions, (tr) => {
      invariant(cm.value, 'CodeMirror is not initialized')
      cm.value.update([tr])
      const { editor, node, getPos } = props
      if (!updating) {
        const textUpdate = tr.state.toJSON().doc
        valueChanged(textUpdate, node, getPos, editor.view)
        forwardSelection(cm.value, editor.view, getPos)
      }
    })
  }

  /**
   * Trigger update if receive update from ProseMirror
   */
  function update() {
    if (updating) return true
    invariant(cm.value, 'CodeMirror is not initialized')
    const newText = props.node.textContent
    const curText = cm.value.state.doc.toString()
    if (newText !== curText) {
      let start = 0
      let curEnd = curText.length
      let newEnd = newText.length
      while (start < curEnd && curText.charCodeAt(start) === newText.charCodeAt(start)) {
        ++start
      }
      while (curEnd > start && newEnd > start && curText.charCodeAt(curEnd - 1) === newText.charCodeAt(newEnd - 1)) {
        curEnd--
        newEnd--
      }
      updating = true
      cm.value.dispatch({
        changes: {
          from: start,
          to: curEnd,
          insert: newText.slice(start, newEnd),
        },
      })
      updating = false
    }
    return true
  }

  const codeContent = computed(() => props.node.textContent ?? '')
  function watchProseMirrorChange() {
    watch(codeContent, (value, old) => {
      if (value === old || !cm.value) return
      update()
    })
  }

  onMounted(() => {
    if (!target.value) {
      return
    }
    cm.value = createCodeMirror(getExtensions(codeMirrorKeyMap()))
  })

  watchProseMirrorChange()

  return {
    cm,
    update,
    codeContent,
    target,
  }
}
