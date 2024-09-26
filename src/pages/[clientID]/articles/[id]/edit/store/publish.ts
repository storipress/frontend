import { defineStore } from 'pinia'

export const usePublishArticleStore = defineStore('publishArticle', () => {
  const sendPublishStateless = ref(false)
  const sendBuildStateless = ref(false)
  const callPublishArticle = ref(false)
  const callBuildArticle = ref(false)

  return {
    sendPublishStateless,
    sendBuildStateless,
    callPublishArticle,
    callBuildArticle,
    SET_SEND_PUBLISH_STATELESS(value: boolean) {
      sendPublishStateless.value = value
    },
    SET_SEND_BUILD_STATELESS(value: boolean) {
      sendBuildStateless.value = value
    },
    SET_CALL_PUBLISH_ARTICLE(value: boolean) {
      callPublishArticle.value = value
    },
    SET_CALL_BUILD_ARTICLE(value: boolean) {
      callBuildArticle.value = value
    },
  }
})
