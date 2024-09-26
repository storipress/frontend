import type { Editor, Range } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import { Suggestion } from '@tiptap/suggestion'

export default Extension.create({
  name: 'aiMenu',

  addOptions() {
    return {
      suggestion: {
        char: '!',
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: new PluginKey('aiMenuSuggestion'),
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
