import { defineStore } from 'pinia'

export const useAIMenuStore = defineStore('aiMenu', () => {
  const abortAI = ref(new AbortController())
  return {
    prompt: ref(''),
    promptType: ref(''),
    chatId: ref(''),
    selectChatId: ref(''),
    response: ref(''),
    responseEnd: ref(true),
    /**
     * Is selected prompt require a snippet from article
     * If it's continue, it should be false, and `askAI` will automatically attach article as reference
     */
    isRangedContent: ref(false),
    abortAI,
    editFrom: ref(0),
    editTo: ref(0),
    bufferContent: ref(''),
    ABORT_CONTROLLER() {
      abortAI.value.abort()
      abortAI.value = new AbortController()
    },
  }
})
