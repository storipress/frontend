import { onUnmounted, ref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import { isChangeOrigin } from '@tiptap/extension-collaboration'
import type { Editor as CoreEditor } from '@tiptap/core'
import type { Node } from 'prosemirror-model'
import type { Transaction } from 'prosemirror-state'
import type * as Y from 'yjs'
import * as Sentry from '@sentry/vue'
import { injectEditorAPI } from './inject-api'
import { pickColor } from './hashColor'
import { configureEditor, createFull } from '~/components/Editor/core'
import { walkChildren } from '~/utils/editor'
import { useAuthStore } from '~/stores/auth'
import { useEditorStore } from '~/stores/editor'
import { GetMeDocument } from '~/graphql-operations'
import { useLinterStore } from '~/stores/linter'
import { warning } from '~/lib/linter'
import { useQuery } from '~/lib/apollo'
import { getAvatarURL } from '~/lib/avatar'
import { useDebugLog, useDelayCleanup } from '~/composables'
import { env } from '~/env'
import { retryConnectTimesLimit } from '~/pages/[clientID]/articles/[id]/edit/setting'
import { usePublishArticleStore } from '~/pages/[clientID]/articles/[id]/edit/store/publish'

const { destroy: destroyEditor, init: initEditor } = useDelayCleanup<Editor>({
  cleanup(editor) {
    editor.destroy()
  },
  delay: 0,
})

export function useEditor(clientID: string, id: string, enableComments = true, ydoc: Y.Doc, isPreview: boolean) {
  const debug = useDebugLog('use-editor')
  const auth = useAuthStore()
  const editorStore = useEditorStore()
  const linterStore = useLinterStore()
  const publishArticleStore = usePublishArticleStore()
  editorStore.id = id

  injectEditorAPI()
  const synced = ref(false)
  const room = `${clientID}.${id}`

  const editor = initEditor(room, (onCleanup) => {
    const { result } = useQuery(GetMeDocument, undefined, { fetchPolicy: 'cache-first' })

    const {
      extensions,
      destroy,
      sendStatelessCheckServer,
      sendStatelessSave,
      sendStatelessPublishArticle,
      sendStatelessBuildArticle,
    } = createFull({
      url: env.VITE_EDITOR_ENDPOINT as string,
      token: auth.token as string,
      room,
      clientID,
      articleID: id,
      enableComments,
      ydoc,
    })
    const editor = configureEditor(extensions)
    let checkConnectInterval: ReturnType<typeof setInterval> | undefined

    watch(result, (data) => {
      if (!data) {
        return
      }
      const { full_name, avatar, id } = data.me
      if (editor.isDestroyed) {
        return
      }

      editor.commands.updateUser({
        id,
        name: full_name,
        avatar: avatar || getAvatarURL(full_name),
        color: `${pickColor(full_name as string)}`,
      })
    })

    whenever(
      () => publishArticleStore.sendPublishStateless,
      () => {
        sendStatelessPublishArticle()
      },
    )

    whenever(
      () => publishArticleStore.sendBuildStateless,
      () => {
        sendStatelessBuildArticle()
      },
    )

    onMounted(() => {
      editorStore.SET_EDITOR(editor)
      checkConnectInterval = setInterval(() => {
        if (editorStore.retryConnectTimes > retryConnectTimesLimit) {
          Sentry.captureException(new Error('hocuspocus server does not return stateless message'))
        }

        sendStatelessCheckServer()
      }, 60 * 1000)
    })

    editor.on('update', handleUpdate)
    editor.on('transaction', handleTransaction)

    editor.on('destroy', () => {
      destroy()
    })

    onCleanup(() => {
      editor.off('update', handleUpdate)
      synced.value = false
    })

    onUnmounted(() => {
      sendStatelessSave()
      editorStore.REMOVE_EDITOR()
      if (!isPreview) {
        destroyEditor(room)
      }
      clearInterval(checkConnectInterval)
    })

    lintBody(linterStore, editor)

    function handleUpdate({ editor }: { editor: CoreEditor }) {
      if (editor.isDestroyed) {
        return
      }
      lintBody(linterStore, editor)
    }

    function handleTransaction({ transaction }: { transaction: Transaction }) {
      // wait for the remote transaction to be applied
      if (synced.value || isChangeOrigin(transaction)) {
        return
      }

      // editor content loaded
      if (isEditorNotEmpty(editor)) {
        // double raf to wait for annotations to be applied
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            debug('synced as loaded')
            synced.value = true
          })
        })
      }
    }

    return editor
  })

  return { editor, synced }
}

function isEditorNotEmpty(editor: CoreEditor) {
  const { doc } = editor.state
  const { firstChild } = doc.content
  if (!firstChild) {
    return false
  }
  return doc.childCount > 1 || firstChild.type.name !== 'paragraph' || firstChild.textContent !== ''
}

async function lintBody(store: ReturnType<typeof useLinterStore>, editor: CoreEditor) {
  const { schema, doc } = editor.state

  let foundMedia = false
  let foundNoAltText = false

  const setFoundMedia = () => {
    foundMedia = true
  }

  await walkChildren(doc.content, {
    [schema.nodes.resource.name]: setFoundMedia,
    [schema.nodes.gallery.name]: setFoundMedia,
    [schema.nodes.image.name]: (node: Node) => {
      setFoundMedia()
      if (!node.attrs?.alt) {
        foundNoAltText = true
        store.issues['body-alt-text'] = warning.noBodyAlt
      }
    },
  })

  if (foundNoAltText) {
    store.issues['body-alt-text'] = warning.noBodyAlt
  } else {
    store.issues['body-alt-text'] = warning.none
  }

  if (!foundMedia) {
    store.issues['no-media'] = warning.noMedia
  } else {
    store.issues['no-media'] = warning.none
  }
}
