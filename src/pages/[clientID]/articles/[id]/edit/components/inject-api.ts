import { once } from 'lodash-es'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import * as Sentry from '@sentry/vue'
import { useEditorAPI } from './api'
import { injectAPI, resolveBookmarkMeta } from '~/components/Editor/core'
import { IFRAMELY_OPTIONS, IGNORE_IFRAME_DOMAINS } from '~/utils/editor/clients/iframely'
import { useComment } from '~/stores/comment'
import { useEditorStore } from '~/stores/editor'

export const injectEditorAPI = once(() => {
  const editorStore = useEditorStore()
  const commentStore = useComment()
  const { oEmbed, uploadImage, createImageURL, getThreads, resolveThread, createThread } = useEditorAPI()
  injectAPI({
    uploadImage: (file) => {
      invariant(editorStore.id)
      return uploadImage(editorStore.id, file)
    },
    createImageURL,
    uploadImageFromURL: () => {
      throw new Error('not implemented')
    },
    getBookmarkMeta: async (url: string, type: string) => {
      const result = z.string().url().safeParse(url)
      if (!result.success) {
        Sentry.captureException(result.error, (scope) => {
          scope.setContext('bookmark', {
            url,
            type,
          })
          return scope
        })
      }

      const domain = new URL(url)
      const data = await oEmbed({
        url,
        params: {
          ...IFRAMELY_OPTIONS,
          type,
          ...(type === 'bookmark' ? { card: '1' } : undefined),
          ...(IGNORE_IFRAME_DOMAINS.has(domain.hostname) ? { iframe: '0' } : undefined),
        },
      })
      return resolveBookmarkMeta(url, data)
    },
    getThreads,

    createComment: (param) => {
      createThread(param)
    },
    removeComment: () => {},
    resolveComment: (id) => {
      resolveThread({ id })
    },

    createPendingComment(pending) {
      commentStore.pendingThread = pending
    },
    removePendingComment() {
      commentStore.pendingThread = null
    },
  })
})
