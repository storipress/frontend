import { defineStore } from 'pinia'

export const useSentryFlagStore = defineStore({
  id: 'sentryFlag',
  state: () => ({
    deletedCommentId: '',
  }),
  actions: {
    SET_DELETED_COMMENT_ID(id: string) {
      this.deletedCommentId = id
    },
  },
})
