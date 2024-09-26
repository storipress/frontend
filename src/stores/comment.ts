import { defineStore } from 'pinia'

export interface PendingComment {
  id: string
  top: number
  position: { from: number; to: number }
  displayTime: string
}

interface ThreadTop {
  id: string
  top: number
}

const initialState = {
  threadTop: [] as ThreadTop[],
  pendingThread: null as null | PendingComment,
  selectedThreadId: '',
}

export const useComment = defineStore({
  id: 'comment',
  state: () => initialState,
  getters: {
    threadTopMap(state) {
      return Object.fromEntries(state.threadTop.map(({ id, top }) => [id, top]))
    },
  },
  actions: {
    SET_THREAD_TOP(tops: ThreadTop[]) {
      this.threadTop = tops
    },

    SET_PENDING(pending: null | PendingComment) {
      this.pendingThread = pending
    },
    SET_SELECTED(id: string) {
      this.selectedThreadId = id
    },
  },
})
