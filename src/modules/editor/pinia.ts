import { Evt } from 'evt'
import { onUnmounted } from 'vue'
import { editorState as useEditorState } from './editor-state/pinia'
import { useWordCount } from './word-count/pinia'
import type { Client, WordStatistics } from '~/components/Editor/core/types'
import { clients, historyState, html, plaintext, saved, wordCount } from '~/utils/editor/global-bus'

export { useEditorState }
export { remoteDialog as useRemoteDialog } from './remote-dialog/pinia'
export { useWordCount } from './word-count/pinia'

export function useListenEditorState() {
  const editorState = useEditorState()
  const wordCountStore = useWordCount()

  function handleHistory(history: { undo: boolean; redo: boolean }) {
    editorState.SET_HISTORY(history)
  }

  function handleSaved(saved: boolean) {
    if (!saved) {
      editorState.SET_SAVED(false)
    }
  }

  function handleWordCount(statistics: WordStatistics) {
    wordCountStore.SET_STATISTICS(statistics)
  }

  function handlePlainText(plaintext: string) {
    editorState.SET_PLAINTEXT(plaintext)
  }

  function handleClients(clients: Client[]) {
    editorState.SET_CLIENTS(clients)
  }

  function handleHTML(html: string) {
    editorState.SET_HTML(html)
  }

  handleHistory(historyState.state)
  handleSaved(saved.state)
  handleWordCount(wordCount.state)
  handlePlainText(plaintext.state)
  handleClients(clients.state)
  handleHTML(html.state)

  const ctx = Evt.newCtx()

  historyState.attach(ctx, handleHistory)
  saved.attach(ctx, handleSaved)
  wordCount.attach(ctx, handleWordCount)
  plaintext.attach(ctx, handlePlainText)
  clients.attach(ctx, handleClients)
  html.attach(ctx, handleHTML)

  onUnmounted(() => {
    ctx.done()
  })
}
