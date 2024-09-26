import { Editor, getSchema } from '@tiptap/vue-3'
import { richInputExtensions } from '@storipress/tiptap-schema'
import doma from 'doma'
import type { Node, Schema } from 'prosemirror-model'
import { DOMParser, DOMSerializer } from 'prosemirror-model'
import invariant from 'tiny-invariant'
import type * as Y from 'yjs'
import Collaboration from '@tiptap/extension-collaboration'
import Placeholder from '@tiptap/extension-placeholder'
import { History } from '@tiptap/extension-history'
import type { Marks } from './schema'

export type MarkCommands = 'toggleItalic' | 'toggleUnderline' | 'toggleBold' | 'toggleLink'

export const MARK_TO_COMMAND: Record<Marks, MarkCommands> = {
  em: 'toggleItalic',
  u: 'toggleUnderline',
  strong: 'toggleBold',
  link: 'toggleLink',
}

export const MARK_TO_NODE: Record<Marks, string> = {
  em: 'italic',
  u: 'underline',
  strong: 'bold',
  link: 'link',
}

const schema = getSchema(richInputExtensions)
export const serializer = DOMSerializer.fromSchema(schema)

export function wrapInParagraph(content: string) {
  const $p = document.createElement('p')

  // compatible for plain text format
  if (content) {
    $p.textContent = content
  }

  return $p
}

export function parse(schema: Schema, content: string, isOne = true) {
  // we must create a DOMParser with the same schema as the editor
  // here we don't need to worry about performance since ProseMirror will cache it
  const parser = DOMParser.fromSchema(schema)
  const $el = (isOne ? doma.one(content) : doma(content)) ?? wrapInParagraph(content)
  // ! must add preserveWhitespace here to allow trailing spaces
  return parser.parse($el, { preserveWhitespace: true })
}

export function serialize(node: Node) {
  return serializer.serializeNode(node)
}

export function update(editor: Editor, content: string, isOne: boolean) {
  const { view, schema } = editor
  const { doc } = view.state
  const node = parse(schema, content, isOne)
  if (!node.sameMarkup(doc)) {
    // how?
    return
  }

  const start = node.content.findDiffStart(doc.content)
  if (start == null) {
    return
  }

  const end = node.content.findDiffEnd(doc.content)
  invariant(end, 'diff could not found end position')

  let { a: endA, b: endB } = end
  const overlap = start - Math.min(endA, endB)
  const { tr } = view.state
  if (overlap > 0) {
    endA += overlap
    endB += overlap
  }
  view.dispatch(tr.replace(start, endB, node.slice(start, endA)))
}

interface OnUpdateParam {
  toHTML: () => string
}

interface CreateEditorOptions {
  content?: string
  ydoc?: Y.Doc
  placeholder?: string
  fieldName?: string
  onUpdate(param: OnUpdateParam): void
  onFocus?: () => void
  onBlur?: () => void
}

export function createEditor({
  ydoc,
  content,
  placeholder,
  onUpdate,
  onFocus,
  onBlur,
  fieldName,
}: CreateEditorOptions) {
  const collaborationExtension = () => {
    return ydoc
      ? [
          Collaboration.configure({
            document: ydoc,
            field: fieldName,
          }),
        ]
      : [History]
  }
  return new Editor({
    content,
    extensions: [
      ...richInputExtensions,
      ...collaborationExtension(),
      Placeholder.configure({
        emptyNodeClass: 'empty-node',
        placeholder: placeholder ?? 'Type caption for image (optional)',
      }),
    ],
    onUpdate({ editor }) {
      onUpdate({
        toHTML: () => editor.getHTML(),
      })
    },
    onFocus,
    onBlur,
  })
}
