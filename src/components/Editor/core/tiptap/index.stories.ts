import { h } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { History } from '@tiptap/extension-history'
import { extensions } from './extensions'
import { CommentStub } from './comment'
import Tiptap from './tiptap.vue'

export default {
  title: 'EditorCore/Core/Tiptap',
  component: Tiptap,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export function Default() {
  return {
    setup: () => {
      const editor = new Editor({
        extensions: [History, CommentStub, ...extensions],
        content: {
          type: 'doc',
        },
      })
      return () => h(Tiptap, { editor, class: 'm-10' })
    },
  }
}
