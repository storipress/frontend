import type { Editor, Range } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { Suggestion } from '@tiptap/suggestion'
import { editorBlockSendTrack } from '../core/utils'

export default Extension.create({
  name: 'commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
          editorBlockSendTrack('slash_menu', { key: props.key })
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
