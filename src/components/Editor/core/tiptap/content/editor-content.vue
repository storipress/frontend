<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { EditorContent } from '@tiptap/vue-3'
import { ref } from 'vue'
import { editorState } from '~/modules/editor/editor-state/pinia'

defineProps<{
  editor: Editor
}>()

const root = ref()
const store = editorState()

function setEditorTop() {
  const { top } = unrefElement(root).getBoundingClientRect()
  store.SET_EDITOR_TOP(top)
}

useEventListener('scroll', setEditorTop, { passive: true })
useResizeObserver(root, setEditorTop)
</script>

<template>
  <EditorContent id="editorContent" ref="root" class="tiptap-content" :editor="editor" />
</template>

<style lang="scss">
.ProseMirror {
  &:focus {
    @apply outline-none;
  }
}

.tiptap-content {
  // stylelint-disable-next-line selector-class-pattern
  .ProseMirror {
    &:focus {
      @apply outline-none;
    }
  }

  // Editor specific style

  .is-editor-empty {
    &.empty-node:only-child {
      &::before {
        @apply absolute cursor-text font-light text-black text-opacity-25 dark:text-white/25;

        content: attr(data-placeholder);
      }
    }
  }

  .article-content {
    li {
      p.empty-node {
        &::before {
          content: '';
          color: transparent;
        }
      }
    }
  }

  .comment {
    @apply bg-yellow-200 dark:bg-yellow-800;
  }

  .selected-comment {
    @apply bg-yellow-300 dark:bg-yellow-900;
  }
}
</style>

<style lang="scss" scoped>
.tiptap-content {
  text-align: left;
}
</style>
