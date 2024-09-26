<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import type * as Y from 'yjs'
import type { MarkCommands } from './create-editor'
import { createEditor, update } from './create-editor'
import RichInputMenu from './rich-input-menu.vue'
import { useNodeState } from './use-node-state'

defineOptions({
  name: 'RichInput',
})

const props = withDefaults(
  defineProps<{
    placeholder?: string
    modelValue?: string
    ydoc?: Y.Doc
    fieldName?: string
  }>(),
  {
    placeholder: '',
    modelValue: undefined,
    ydoc: undefined,
    fieldName: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [string]
  blur: []
  focus: []
  'update:format': []
}>()

const linkMode = ref(false)

function content() {
  if (!props.ydoc) {
    return { content: props.modelValue }
  }
  return {}
}

const editor = createEditor({
  ...content(),
  ydoc: props.ydoc,
  fieldName: props.fieldName,
  placeholder: props.placeholder,
  onUpdate: ({ toHTML }) => {
    emit('update:modelValue', toHTML())
  },
  onFocus: () => {
    emit('focus')
  },
  onBlur: () => {
    emit('blur')
  },
})

const { nodeState, updateState } = useNodeState({ editor })

defineExpose({
  focus() {
    editor.view.focus()
  },
})

if (!props.ydoc) {
  watch(
    () => props.modelValue,
    (value) => {
      if (editor && value != null) {
        update(editor, value, true)
      }
    },
  )
}

onMounted(() => {
  editor.view.dom.classList.add('no-drop')
})

onBeforeUnmount(() => {
  editor.destroy()
})

function toggleLink() {
  if (editor.isActive('link')) {
    editor.commands.unsetLink()
  } else {
    linkMode.value = true
  }
}

function setLink(href: string) {
  if (editor.isActive('link') && !href) {
    editor.commands.unsetLink()
  } else if (href) {
    editor.commands.setLink({ href })
  }
  linkMode.value = false
}

function applyFormat(name: Exclude<MarkCommands, 'setLink' | 'toggleLink'>) {
  emit('update:format')
  editor.commands[name]()
  updateState()
  editor.commands.focus()
}
</script>

<template>
  <div class="rich-input">
    <EditorContent :editor="editor" style="white-space: pre-wrap; user-select: text" />
    <RichInputMenu
      v-model:link-mode="linkMode"
      :node-state="nodeState"
      :editor="editor"
      @update-node-state="updateState"
      @toggle-link="toggleLink"
      @apply-format="applyFormat"
      @set-link="setLink"
    />
  </div>
</template>

<style lang="scss" scoped>
.rich-input {
  @apply relative;

  &::v-deep {
    & > div {
      font-family: inherit;
    }

    // stylelint-disable-next-line selector-class-pattern
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
          @apply absolute inset-0 block w-full cursor-text overflow-hidden whitespace-nowrap font-light text-black text-opacity-25 dark:text-white/25;

          content: attr(data-placeholder);
        }
      }
    }
  }
}
</style>

<style lang="scss">
.rich-input {
  .is-editor-empty {
    &.empty-node:only-child {
      &::before {
        @apply dark:text-white/25;
      }
    }
  }
}
</style>
