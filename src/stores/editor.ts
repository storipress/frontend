import type { Editor } from '@tiptap/core'
import { defineStore } from 'pinia'
import { truncate } from 'lodash-es'
import type { DeferredPromise } from 'p-defer'
import pDefer from 'p-defer'
import type { TableOfContentData } from '@tiptap-pro/extension-table-of-content'

interface TEditor {
  id: string
  editor: Editor | null
  retryConnectTimes: number
  content: string
  docChanged: boolean
  tocItems: TableOfContentData
  deferredGetArticle: DeferredPromise<unknown>
  deferredGetYdoc: DeferredPromise<unknown>
  deferredGetIndexedDB: DeferredPromise<unknown>
  apiIsRunning: boolean
}

export const useEditorStore = defineStore({
  id: 'editor',
  state: (): TEditor => ({
    id: '',
    editor: null,
    retryConnectTimes: 0,
    content: '',
    docChanged: false,
    tocItems: [],
    deferredGetArticle: pDefer(),
    deferredGetYdoc: pDefer(),
    deferredGetIndexedDB: pDefer(),
    apiIsRunning: false,
  }),
  actions: {
    SET_RETRY_CONNECT_TIMES(times: number) {
      this.retryConnectTimes = times
    },
    SET_EDITOR(editor: Editor) {
      this.editor = editor

      editor.on('transaction', ({ transaction }) => {
        if (transaction.docChanged) {
          this.docChanged = true
        }
      })
    },
    GET_CONTENT() {
      if (this.docChanged) {
        this.docChanged = false
        const htmlContent = this.editor?.getHTML() ?? ''

        // backend tokens limit is 48000
        this.content =
          htmlContent?.length <= 48000
            ? htmlContent
            : truncate(this.editor?.getText() ?? '', { length: 48000, separator: ' ' })
      }

      return this.content
    },
    SET_TOC_ITEMS(items: TableOfContentData) {
      this.tocItems = items
    },
    SET_API_IS_RUNNING(value: boolean) {
      this.apiIsRunning = value
    },
    REMOVE_EDITOR() {
      this.editor = null
    },
    RESET_STORE() {
      this.id = ''
      this.editor = null
      this.retryConnectTimes = 0
      this.content = ''
      this.docChanged = false
      this.tocItems = []
      this.deferredGetArticle = pDefer()
      this.deferredGetYdoc = pDefer()
      this.deferredGetIndexedDB = pDefer()
      this.apiIsRunning = false
    },
  },
})
