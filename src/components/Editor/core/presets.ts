import { Collaboration } from '@tiptap/extension-collaboration'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import { History } from '@tiptap/extension-history'
import { debounce, noop } from 'lodash-es'
import { Extension } from '@tiptap/core'
import type * as Y from 'yjs'
import type { onMessageParameters, onStatelessParameters } from '@hocuspocus/provider'
import { HocuspocusProvider, MessageType } from '@hocuspocus/provider'
import { destr } from 'destr'
import { constant, stubFalse } from 'lodash'
import * as Sentry from '@sentry/vue'
import { TableOfContent } from '@tiptap-pro/extension-table-of-content'
import { z } from 'zod'
import { synced } from './tiptap/plugins/content-linter/hook'
import { Comment } from './tiptap/comment'
import { extensions } from './tiptap/extensions'
import { CollaborationAnnotation, ReadUser, contentLinter, linterDecoration } from './tiptap/plugins'
import { renderCursor } from './tiptap/render-cursor'
import type { EditorUser } from './types'
import { instanceId, sendLog } from './axiom-log'
import { clients, saved } from '~/utils/editor/global-bus'
import { useEditorStore } from '~/stores/editor'
import { editorState as useEditorState } from '~/modules/editor/editor-state/pinia'
import { useMeStore } from '~/stores/me'
import { usePublishArticleStore } from '~/pages/[clientID]/articles/[id]/edit/store/publish'

const stubCommand = constant(stubFalse)
const CommentStub = Extension.create({
  name: 'commentStub',

  priority: 1000,

  addCommands() {
    return {
      addDraftComment: stubCommand,
      addComment: stubCommand,
      removeComment: stubCommand,
      removeSelectComment: stubCommand,
      toggleComment: stubCommand,
    }
  },
})
export const base = [...extensions, History, CommentStub]

const statelessSchema = z.object({
  checkServer: z.literal(true).optional(),
  publishArticle: z.literal(true).optional(),
  buildArticle: z.literal(true).optional(),
})

/**
 * options to create full preset
 */
export interface FullPresetInput {
  /// host to connect
  url: string
  /// auth token
  token: string
  /// format `<client id>.<article id>`
  room: string
  enableComments?: boolean
  clientID: string
  articleID: string
  ydoc: Y.Doc
  onSynced?: () => void
}

export function createFull({
  url,
  token,
  room,
  articleID,
  clientID,
  enableComments = true,
  onSynced = noop,
  ydoc,
}: FullPresetInput) {
  // Registered with a WebSocket provider
  let retryTimes = 0
  let updateMouted = false
  const online = useOnline()
  const me = useMeStore()
  const editorStore = useEditorStore()
  const editorState = useEditorState()
  const publishArticleStore = usePublishArticleStore()

  sendTrack('editor_session_start', { article_id: articleID, instance_id: instanceId })

  const provider = new HocuspocusProvider({
    document: ydoc,
    url,
    name: room,
    parameters: { uid: token, initialized: '0' },
    onClose() {
      retryTimes += 1
      if (retryTimes === 3) {
        Sentry.captureException(new Error("doesn't have article permission"), (scope) => {
          scope.setTag('permission', 'error')
          return scope
        })
      }
    },
    onSynced({ state }) {
      retryTimes = 0
      if (state) {
        editorStore.deferredGetYdoc.resolve()
        onSynced()
        synced.trigger()
      }
    },
    onOutgoingMessage: ({ message }) => {
      if (message.type === MessageType.Awareness) {
        return
      }
      sendLog({
        userId: me.me?.id ?? '',
        clientId: clientID,
        articleId: articleID,
        message,
      })
    },
    onMessage: ({ message }: onMessageParameters) => {
      const body = new Uint8Array(message.data)
      // the header of sync message
      if (body[0] === 0x00 && body[1] === 0x02) {
        saved.post(true)
      }
    },
    onStateless: ({ payload }: onStatelessParameters) => {
      const message = statelessSchema.safeParse(destr(payload))
      if (message.success) {
        if (message.data.checkServer) {
          editorStore.SET_RETRY_CONNECT_TIMES(0)
        } else if (message.data.publishArticle) {
          publishArticleStore.SET_CALL_PUBLISH_ARTICLE(true)
        } else if (message.data.buildArticle) {
          publishArticleStore.SET_CALL_BUILD_ARTICLE(true)
        }
      } else {
        Sentry.captureException(new Error('Client stateless parse error'), (scope) => {
          scope.setContext('response', { payload })
          return scope
        })
      }
    },
  })

  useEventListener(document, 'click', () => {
    if (!updateMouted) {
      updateMouted = true
      ydoc.on(
        'update',
        // the first message is for initialized article
        (_, origin) => {
          // if origin is null, it came from spellcheck or linter
          if (origin) {
            saved.post(false)
          }
        },
      )
    }
  })

  ydoc.once('update', () => {
    provider.setConfiguration({
      parameters: { uid: token, initialized: '1' },
    })
  })

  ydoc.on(
    'update',
    debounce(() => {
      if (online.value) {
        editorState.SET_SAVED(true)
      }
    }, 1000),
  )

  watch(online, (isOnline) => {
    if (isOnline) {
      editorState.SET_SAVED(true)
    }
  })

  const exts = [
    ...extensions,
    TableOfContent.configure({
      onUpdate: editorStore.SET_TOC_ITEMS,
    }),
    Collaboration.configure({
      document: ydoc,
    }),
    CollaborationCursor.configure({
      provider,
      render: renderCursor,
    }),
    contentLinter.configure({
      document: ydoc,
    }),
    linterDecoration.configure({
      document: ydoc,
    }),
    ReadUser.configure({
      onUpdate(users) {
        clients.post(
          users.map(({ clientId, ...user }) => ({
            clientID: `${clientId}`,
            user: user as EditorUser,
          })),
        )
        return null
      },
    }),
  ]

  if (enableComments) {
    exts.push(
      CollaborationAnnotation.configure({
        document: ydoc,
        HTMLAttributes: {
          class: 'comment',
        },
      }),
      Comment,
    )
  } else {
    exts.push(CommentStub)
  }

  return {
    extensions: exts,
    sendStatelessCheckServer() {
      editorStore.SET_RETRY_CONNECT_TIMES(editorStore.retryConnectTimes + 1)
      provider.sendStateless(JSON.stringify({ checkServer: true }))
    },
    sendStatelessSave() {
      provider.sendStateless(JSON.stringify({ save: true }))
    },
    sendStatelessPublishArticle() {
      provider.sendStateless(JSON.stringify({ publishArticle: true }))
    },
    sendStatelessBuildArticle() {
      provider.sendStateless(JSON.stringify({ buildArticle: true }))
    },
    destroy() {
      provider.destroy()
    },
  }
}
