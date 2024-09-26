import type { Editor } from '@tiptap/core'
import { Evt } from 'evt'
import type { Transaction } from '@tiptap/pm/state'
import { fromHTML } from './to-description'

import type { Client, WordStatistics } from './types'

export { warnExceedSizeLimit } from '~/components/Editor/core/schema/schema-bus'

interface TransactionInfo {
  editor: Editor
  tr: Transaction | null
}

export const transaction = Evt.create<TransactionInfo>()

export const wordCount = Evt.create<WordStatistics>({
  characters: 0,
  images: 0,
  paragraphs: 0,
  spaces: 0,
  words: 0,
})

export const clients = Evt.create<Client[]>([])

export const saved = Evt.create<boolean>(true)

export const historyState = transaction
  .pipe(({ editor }) => [{ undo: editor.can().undo(), redo: editor.can().redo() }])
  .toStateful({ undo: false, redo: false })

export const documentModify = transaction.pipe(({ tr }) => {
  return tr?.docChanged || false
})

export const html = transaction
  .pipe(({ editor }) => {
    const res = editor.getHTML()
    return [res]
  })
  .toStateful('')

export const plaintext = html
  .pipe((html) => {
    if (!html) return ['']
    let sliceHtml = html.slice(0, 200)
    const lastTag = sliceHtml.slice(-4)

    if (lastTag !== '</p>') sliceHtml += '</p>'
    const res = fromHTML(sliceHtml)
    return [res]
  })
  .toStateful('')

export const undo = Evt.create()
export const redo = Evt.create()
export const focus = Evt.create()

export function useEditorEventBus() {
  return {
    undo() {
      undo.post()
    },
    redo() {
      redo.post()
    },
  }
}
