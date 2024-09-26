<script setup lang="ts">
import { mergeTailwind } from '@storipress/core-component'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { schemaExtensions } from '@storipress/tiptap-schema'
import { Placeholder } from '@tiptap/extension-placeholder'
import { RichInputMenu, update, useNodeState } from '~/components/Editor/rich-input'
import type { MarkCommands } from '~/components/Editor/rich-input'

defineOptions({
  name: 'RichTextArea',
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  textareaWidth: {
    type: String,
    default: '',
  },
  textareaHeight: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const editorWrapper = ref(null)
const showBoldBorder = ref(false)
const editor = new Editor({
  extensions: [
    ...schemaExtensions,
    Placeholder.configure({
      emptyNodeClass: 'empty-node',
      placeholder:
        props.placeholder ??
        'A short paragraph that tells readers a little bit about you, and how to contact or read more of your content.',
    }),
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.getHTML())
  },
})

function focusInput() {
  showBoldBorder.value = true
  editor.commands.focus()
}

onClickOutside(editorWrapper, () => {
  showBoldBorder.value = false
})

// #### Below copied from src/components/Editor/rich-input/rich-input.vue
const linkMode = ref(false)
const { nodeState, updateState } = useNodeState({ editor })

function toggleLink() {
  if (editor.isActive('link')) {
    editor.commands.unsetLink()
  } else {
    linkMode.value = true
  }
}

function setLink(href: string) {
  if (href) {
    editor.commands.setLink({ href })
  }
  linkMode.value = false
}

function applyFormat(name: MarkCommands) {
  emit('update:modelValue')
  editor.commands[name]({})
  updateState()
  editor.commands.focus()
}

watch(
  () => props.modelValue,
  (val) => {
    if (editor && val !== null) {
      update(editor, val, false)
    }
  },
)

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<template>
  <label class="text-body text-stone-800" for="author-byline" @click="focusInput">Author bio</label>
  <div v-if="editor" ref="editorWrapper" class="relative mt-1">
    <EditorContent
      id="author-byline"
      data-testid="Author byline"
      class="editor__content overflow-y-auto rounded border px-3 pb-[0.56rem]"
      :class="
        mergeTailwind([
          showBoldBorder ? 'border-sky-600 ring-1 ring-sky-600' : 'border-gray-400',
          textareaWidth ?? 'w-[31.5rem]',
          textareaHeight ?? 'h-[5.5rem]',
        ])
      "
      :editor="editor"
      @click="showBoldBorder = true"
      @blur="showBoldBorder = false"
    />
    <RichInputMenu
      v-model:link-mode="linkMode"
      :editor="editor"
      :node-state="nodeState"
      @set-link="setLink"
      @toggle-link="toggleLink"
      @update-node-state="updateState"
      @apply-format="applyFormat"
    />
  </div>
</template>

<style scoped>
.editor__content {
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0.25rem 0.75rem;
  -webkit-overflow-scrolling: touch;

  &::v-deep {
    & > div {
      font-family: inherit;
    }
    .ProseMirror {
      font-family: inherit;
      &:focus {
        @apply outline-none;
      }
    }

    a {
      @apply font-bold underline opacity-50;
    }

    h1,
    h2,
    h3,
    p,
    blockquote,
    pre,
    ul,
    ol {
      margin: 0;
      font-family: inherit;
    }

    .is-editor-empty {
      &.empty-node:only-child {
        &::before {
          @apply absolute inset-0 block w-full cursor-text  whitespace-normal font-light text-black text-opacity-25;

          content: attr(data-placeholder);
        }
      }
    }
  }
}
</style>
