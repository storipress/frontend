import codemark from '@storipress/prosemirror-codemark'
import { Extension } from '@tiptap/core'
import '@storipress/prosemirror-codemark/dist/codemark.css'

export const Codemark = Extension.create({
  name: 'codemarkPlugin',
  addProseMirrorPlugins() {
    const code = codemark({ markType: this.editor.schema.marks.code, pluginKey: 'codemark-code' })
    const link = codemark({ markType: this.editor.schema.marks.link, pluginKey: 'codemark-link' })
    return [...code, ...link]
  },
})
