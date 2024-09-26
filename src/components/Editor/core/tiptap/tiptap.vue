<script lang="ts">
import type { Editor as CoreEditor } from '@tiptap/core'
import type { Editor } from '@tiptap/vue-3'
import type { PropType } from 'vue'
import { debounce } from 'lodash-es'
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Evt } from 'evt'
import type { Transaction } from 'prosemirror-state'
import { shouldShow } from './bubble-should-show'

import { EditorContent } from './content'
import { ExtraSpace } from './extra-space'
import { FloatingMenu } from './floating-menu'
import { listener } from './iframe-resize-listener'
import { BubbleMenu } from './menu'
import { contrast, findBackgroundProvider } from '~/utils/editor'
import { focus, redo, transaction, undo } from '~/utils/editor/global-bus'

function postTransaction({ editor, transaction: tr }: { editor: CoreEditor; transaction: Transaction | null }) {
  transaction.post({ editor, tr })
}

export default defineComponent({
  components: {
    EditorContent,
    BubbleMenu,
    FloatingMenu,
    ExtraSpace,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    collaborative: {
      type: Boolean,
      default: false,
    },
    extraClass: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    isPreview: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const ctx = Evt.newCtx()
    const root = ref<HTMLElement>()
    const active = ref(false)
    const variant = ref('active-light')

    onMounted(async () => {
      undo.attach(ctx, () => {
        props.editor?.commands.undo()
      })

      redo.attach(ctx, () => {
        props.editor?.commands.redo()
      })

      focus.attach(ctx, () => {
        const { editor } = props
        if (!editor) {
          return
        }
        editor.commands.focus()
        editor.view.focus()
      })

      window.addEventListener('message', listener)

      await nextTick()
      const el = findBackgroundProvider(root.value as HTMLElement)
      const style = window.getComputedStyle(el)
      variant.value = `active-${contrast(style.backgroundColor)}`
    })

    function onFocus() {
      active.value = true
    }

    function onBlur() {
      active.value = false
    }

    const debounceTransaction = debounce(({ editor, transaction }) => {
      postTransaction({ editor, transaction })
    }, 1000)

    watch(
      () => props.editor,
      async (editor) => {
        if (editor) {
          await nextTick()
          postTransaction({ editor, transaction: null })
          editor.on('transaction', debounceTransaction)
          editor.on('focus', onFocus)
          editor.on('blur', onBlur)
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      window.removeEventListener('message', listener)
      const { editor } = props
      if (editor) {
        editor.off('transaction', debounceTransaction)
        editor.off('focus', onFocus)
        editor.off('blur', onBlur)
        !props.isPreview && editor.destroy()
      }
      ctx.done()
    })

    return {
      root,
      shouldShow,
      active,
      variant,
    }
  },
})
</script>

<template>
  <div ref="root" class="group relative cursor-text" :class="[active && $style.active, variant]">
    <BubbleMenu :editor="editor" :should-show="shouldShow" />

    <FloatingMenu :editor="editor" />

    <EditorContent :class="[$style.activeShadow, ...extraClass]" :editor="editor" />

    <ExtraSpace :class="$style.activeShadow" :editor="editor" />
  </div>
</template>

<style lang="scss" module>
.active-shadow {
  @apply transition-shadow;

  :global(.active-light).active &,
  :global(.group.active-light):hover & {
    @apply shadow-2;
  }

  :global(.active-dark).active &,
  :global(.group.active-dark):hover & {
    @apply shadow-w2;
  }
}
</style>

<style lang="scss">
.editor-menu-effect {
  &[data-state='hidden'] {
    @apply opacity-0;
  }

  &[data-state='visible'] {
    @apply opacity-100;
  }
}
</style>
