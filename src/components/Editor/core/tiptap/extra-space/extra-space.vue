<script lang="ts">
import type { Editor } from '@tiptap/core'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    editor: {
      type: Object as PropType<Editor>,
    },
  },

  setup(props) {
    return {
      appendLines(i: number) {
        const { editor } = props

        if (!editor) {
          return
        }

        editor.commands.insertContentAt(
          editor.state.doc.nodeSize - 2,
          Array.from({ length: i }, () => ({ type: 'paragraph' })),
        )
        editor
          .chain()
          .setTextSelection(editor.state.doc.nodeSize - 2)
          .focus()
          .run()
        editor.view.focus()
      },
    }
  },
})
</script>

<template>
  <div>
    <p v-for="i of 6" :key="i" @click="appendLines(i)"><br /></p>
  </div>
</template>
