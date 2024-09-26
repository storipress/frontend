import type { AnyExtension } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import { Placeholder } from '@tiptap/extension-placeholder'
import UniqueID from '@tiptap-pro/extension-unique-id'
import type { Transaction } from 'prosemirror-state'

import { schemaExtensions } from '../schema'
import { AIMenu, AIWritingMenu, writeMenuOptions } from '../../AIMenu'
import {
  CodeBlock,
  Codemark,
  FocusClasses,
  Markdown,
  WordCount,
  commentHighlight,
  dropImage,
  pasteExternalImage,
  trackPaste,
} from './plugins'
import { Commands, Suggestion } from '~/components/Editor/SlashMenu'

export const setAttributes = Extension.create({
  name: 'setAttributes',
  onCreate() {
    const { view } = this.editor
    view.dom.classList.add('article-content', 'main-content')
    view.dom.setAttribute('spellcheck', 'true')
    return {}
  },
})

export const extensions: AnyExtension[] = [
  ...schemaExtensions,
  CodeBlock,
  Codemark,
  AIMenu,
  AIWritingMenu.configure(writeMenuOptions),
  Dropcursor,
  Gapcursor,
  FocusClasses,
  commentHighlight,
  Placeholder.configure({
    emptyNodeClass: 'empty-node',
    placeholder: "Start writing here. Press 'space' for Storipress AI or type '/' for quick actions.",
  }),
  Commands.configure({
    suggestion: Suggestion,
  }),
  setAttributes,
  dropImage,
  pasteExternalImage,
  trackPaste,
  WordCount,
  Markdown,
  UniqueID.configure({
    types: ['heading', 'paragraph', 'image', 'embed', 'resource', 'gallery', 'codeBlock', 'table', 'tableOfContent'],
    filterTransaction: (transaction: Transaction) => {
      // Prevent replace step which from is 0, because it is a auto generated step from ydoc
      return (
        transaction.getMeta('addToHistory') !== false &&
        transaction.docChanged &&
        transaction.steps.length > 0 &&
        transaction.steps[0].toJSON().to !== transaction.doc.content.size
      )
    },
  }),
]
