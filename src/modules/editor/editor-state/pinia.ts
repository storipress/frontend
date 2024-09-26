import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Client } from '~/components/Editor/core/types'

interface HistoryState {
  undo: boolean
  redo: boolean
}

const initialState = {
  history: {
    undo: false,
    redo: false,
  },
  saved: true,
  html: '',
  plaintext: '',
  scrollTop: 0,
  editorTop: 0,
  clients: [] as Client[],
}

export const editorState = defineStore('editorState', () => {
  const state = reactive(initialState)

  return {
    state,
    SET_HISTORY(history: HistoryState) {
      state.history = history
    },

    SET_SAVED(saved: boolean) {
      state.saved = saved
    },

    SET_HTML(html: string) {
      state.html = html
    },

    SET_PLAINTEXT(plaintext: string) {
      state.plaintext = plaintext
    },

    SET_CLIENTS(clients: Client[]) {
      state.clients = clients
    },

    SET_SCROLL_TOP(scrollTop: number) {
      state.scrollTop = scrollTop
    },

    SET_EDITOR_TOP(editorTop: number) {
      state.editorTop = editorTop
    },
  }
})
