import { createIframelyProxyClient } from '../utils'
import type { IFramely as IframelyResponse } from '~/utils/editor/clients/iframely'
import type { CommentThread } from '~/components/Editor/core'
import type { IframelyIframelyInput } from '~/graphql-operations'
import { ListThreadsDocument, SignIframelySignatureDocument, UploadImage } from '~/graphql-operations'
import { useApolloClient } from '~/lib/apollo'
import { useEditorStore } from '~/stores/editor'
import { useCommentAPI, useUploadImage } from '~/composables'
import { getAvatarURL } from '~/lib/avatar'

const IMG_CDN = 'https://assets.stori.press'

export function useEditorAPI() {
  const editorStore = useEditorStore()
  const { client } = useApolloClient()
  const { createThread, resolveThread, removeNote } = useCommentAPI()
  const uploadArticleImage = useUploadImage()

  return {
    uploadImage(id: string, file: File) {
      return uploadArticleImage({
        id,
        file,
        type: UploadImage.ArticleContentImage,
      })
    },
    createImageURL,
    async oEmbed(input: IframelyIframelyInput): Promise<IframelyResponse> {
      const { data: SignatureData } = await client.mutate({
        mutation: SignIframelySignatureDocument,
        variables: {
          params: JSON.stringify({ url: input.url, ...input.params }),
        },
      })
      const proxyClient = createIframelyProxyClient()
      const iframelyResult = await proxyClient.create(
        { url: input.url, ...input.params },
        SignatureData?.signIframelySignature,
      )
      return iframelyResult
    },
    async getThreads(): Promise<CommentThread[]> {
      const res = await client.query({
        query: ListThreadsDocument,
        variables: {
          id: editorStore.id,
        },
      })

      return (res.data.article?.threads ?? []).map(({ id, notes, position, resolved_at }) => ({
        id,
        resolved: Boolean(resolved_at),
        position: JSON.parse(position),
        comments: notes.map(({ id, user, content, created_at }) => ({
          id,
          author: {
            ...user,
            name: user.full_name ?? '',
            avatar: user.avatar || getAvatarURL(user.full_name),
          },
          content,
          time: new Date(created_at),
        })),
      }))
    },
    createThread,
    removeNote,
    resolveThread,
  }
}

export function createImageURL(path: string, edits: Record<string, string> = {}) {
  const params = new URLSearchParams(edits)
  if (typeof path === 'string' && !path.startsWith(IMG_CDN)) {
    path = `${IMG_CDN}/${path}`
  }

  const url = new URL(path)
  url.search = params.toString()

  return url.toString()
}
