import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { useComment } from '~/stores/comment'
import { getAPI } from '~/components/Editor/core/api'

export const commentHighlight = Extension.create({
  name: 'comment-highlight',

  addProseMirrorPlugins() {
    const editor = this.editor
    const { removePendingComment } = getAPI()
    return [
      new Plugin({
        key: new PluginKey('comment-highlight'),
        props: {
          handleClick(_, __, event) {
            if (window.top !== window) {
              return
            }

            const store = useComment()
            const { threadTop, SET_SELECTED } = store
            const clickedId = event.target?.dataset.id

            if (clickedId) {
              const thread = threadTop.find(({ id }) => id === clickedId)
              if (thread) {
                SET_SELECTED(thread.id)
              }
            } else {
              SET_SELECTED('')
            }
            editor.commands.refreshAnnotation()
            editor.commands.deleteAnnotation(store.pendingThread?.id || '')
            removePendingComment()
          },
        },
      }),
    ]
  },
})
