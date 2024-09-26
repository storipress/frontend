<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { useRoute } from 'vue-router'
import type * as Y from 'yjs'
import * as Sentry from '@sentry/vue'
import { useEditor } from './use-editor'
import { Tiptap } from '~/components/Editor/core'
import { useListenEditorState } from '~/modules/editor/pinia'
import { CommentArea } from '~/components/Editor/Comment'

const props = defineProps<{ id: string; ydoc: Y.Doc }>()

useListenEditorState()
const route = useRoute()
const root = ref<HTMLElement>()
const left = ref(0)
const width = ref(0)
const nowId = route.params.id
useResizeObserver(
  root,
  debounce(() => {
    if (root.value) {
      const rect = root.value.getBoundingClientRect()
      const body = document.querySelector('body')
      left.value = rect.left

      if (body instanceof HTMLElement) {
        const bodyRect = body.getBoundingClientRect()
        width.value = bodyRect.width
      }
    }
  }, 10),
)

const { editor, synced } = useEditor(
  route.params.clientID as string,
  route.params.id as string,
  true,
  props.ydoc,
  false,
)

watch(editor, (val) => {
  if (!val && nowId === route.params.id) {
    Sentry.captureException(new Error('Editor unexpected destroyed'), (scope) => {
      scope.setContext('article', { content: props.ydoc.getXmlFragment('default').toJSON() })
      return scope
    })
  }
})
</script>

<template>
  <div class="flex w-full md:w-[45rem]">
    <div ref="root" class="article-content w-full" :style="`--left-offset: ${left}px;--body-width: ${width}px`">
      <Tiptap v-if="editor" :editor="editor" collaborative :is-preview="false" />
    </div>
    <CommentArea v-if="synced && editor" :id="id" :ydoc="ydoc" :editor="editor" />
  </div>
</template>

<style lang="scss" scoped>
.article-content {
  :deep(.main-content) {
    // use > p because other card like gallery also have p tag, we don't want to change their style
    > p {
      @apply rounded-lg p-2 font-iAWriterQuattro text-base leading-[1.75] text-stone-900 dark:text-stone-200;
      @apply mb-[1.5em];
    }
    ul p {
      @apply rounded-lg px-2 font-iAWriterQuattro text-base leading-[1.75] dark:text-stone-200;
    }
    ol p {
      @apply rounded-lg px-2 font-iAWriterQuattro text-base leading-[1.75] dark:text-stone-200;
    }
    blockquote {
      @apply px-2 font-iAWriterQuattro text-base italic leading-[1.75] text-stone-600 dark:text-stone-400;
    }

    a:not(.bookmark__link, .image_link) {
      @apply dark:opacity-70;
    }

    h1 {
      @apply rounded-lg p-2 font-iAWriterQuattro dark:text-stone-200;
      font-size: 2.5em;
      font-variation-settings:
        'wght' 500,
        'SPCG' 0;
      line-height: 1.111;
      strong {
        font-variation-settings:
          'wght' 700,
          'SPCG' 0;
      }
    }
    h2 {
      @apply rounded-lg p-2 font-iAWriterQuattro dark:text-stone-200;
      font-size: 2em;
      font-variation-settings:
        'wght' 500,
        'SPCG' 0;
      line-height: 1.111;
      strong {
        font-variation-settings:
          'wght' 700,
          'SPCG' 0;
      }
    }
    h3 {
      @apply rounded-lg p-2 font-iAWriterQuattro dark:text-stone-200;
      font-size: 1.5em;
      font-variation-settings:
        'wght' 400,
        'SPCG' 0;
      line-height: 1.333;
      strong {
        font-variation-settings:
          'wght' 600,
          'SPCG' 0;
      }
    }
    blockquote {
      @apply border-l-4 border-stone-300 pl-2 dark:border-stone-700;
    }
  }
}
</style>

<style lang="scss" scoped>
.article-content {
  :deep(.main-content) {
    // use > p because other card like gallery also have p tag, we don't want to change their style
    > p {
      @apply dark:text-stone-200;
    }
    ul {
      @apply dark:marker:text-stone-200;
    }
    ul p {
      @apply dark:text-stone-200;
    }
    ol {
      @apply dark:marker:text-stone-200;
    }
    ol p {
      @apply dark:text-stone-200;
    }
    blockquote {
      @apply dark:text-stone-400;
    }

    a:not(.bookmark__link, .image_link) {
      @apply dark:opacity-70;
    }

    h1 {
      @apply dark:text-stone-200;
    }
    h2 {
      @apply dark:text-stone-200;
    }
    h3 {
      @apply dark:text-stone-200;
    }
    blockquote {
      @apply dark:border-stone-700;
    }
  }
}
</style>

<style lang="scss">
.dark {
  .main-content {
    table {
      --tw-prose-body: var(--tw-prose-invert-body);
      --tw-prose-headings: var(--tw-prose-invert-headings);
      --tw-prose-lead: var(--tw-prose-invert-lead);
      --tw-prose-links: var(--tw-prose-invert-links);
      --tw-prose-bold: var(--tw-prose-invert-bold);
      --tw-prose-counters: var(--tw-prose-invert-counters);
      --tw-prose-bullets: var(--tw-prose-invert-bullets);
      --tw-prose-hr: var(--tw-prose-invert-hr);
      --tw-prose-quotes: var(--tw-prose-invert-quotes);
      --tw-prose-quote-borders: var(--tw-prose-quote-borders);
      --tw-prose-captions: var(--tw-prose-invert-captions);
      --tw-prose-code: var(--tw-prose-invert-code);
      --tw-prose-pre-code: var(--tw-prose-invert-pre-code);
      --tw-prose-pre-bg: var(--tw-prose-invert-pre-bg);
      --tw-prose-th-borders: var(--tw-prose-invert-th-borders);
      --tw-prose-td-borders: var(--tw-prose-invert-td-borders);
    }
  }
}
</style>
