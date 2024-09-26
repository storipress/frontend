<script lang="ts" setup>
import { Editor } from '@tiptap/vue-3'
import { schemaExtensions } from '@storipress/tiptap-schema'
import { Image } from '../core/schema/image'
import { Gallery } from '../core/schema/gallery'
import { Embed } from '../core/schema/embed'
import { Resource } from '../core/schema/resource'
import { TableOfContent } from '../core/schema/table-of-content'
import Commands from './commands'
import suggestion from './suggestion'
import EditorContent from '~/components/Editor/core/tiptap/content/editor-content.vue'

const editor = new Editor({
  extensions: [
    ...schemaExtensions,
    Image,
    Gallery,
    Embed,
    Resource,
    TableOfContent,
    Commands.configure({
      suggestion,
    }),
  ],
  content: `
      <p></p>
    `,
})

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<template>
  <div class="article-content">
    <EditorContent class="main-content prose prose-neutral prose-li:marker:text-stone-800" :editor="editor" />
  </div>
</template>
