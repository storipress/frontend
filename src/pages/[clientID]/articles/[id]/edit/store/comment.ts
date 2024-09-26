import { defineStore } from 'pinia'
import type * as Y from 'yjs'

export const useCommentYdocStore = defineStore('commentYdoc', () => {
  const ydoc = shallowRef<null | Y.Doc>(null)

  return {
    ydoc,
    SET_YDOC(value: Y.Doc) {
      ydoc.value = markRaw(value)
    },
  }
})
