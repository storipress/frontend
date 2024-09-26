import { CodeBlock as TipTapCodeBlock } from '@tiptap/extension-code-block'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockView from './CodeBlockView.vue'

export const CodeBlock = TipTapCodeBlock.extend({
  isolating: true,
  addNodeView() {
    return VueNodeViewRenderer(CodeBlockView, {
      stopEvent: (event) => {
        return event instanceof KeyboardEvent
      },
    })
  },
})
