import { defineStore } from 'pinia'

export const useEditorNotificationStore = defineStore({
  id: 'editorNotification',
  state: () => ({
    errorCode: 0,
    errorContent: '',
  }),
  actions: {
    SET_ERROR_CODE(errorCode: number) {
      this.errorCode = errorCode
    },
    SET_ERROR_CONTENT(errorContent: string) {
      this.errorContent = errorContent
    },
  },
})
