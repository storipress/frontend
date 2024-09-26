<script lang="ts">
import { quote } from './preview-article'
import { Element } from './base'

export default defineComponent({
  mixins: [Element],
  setup() {
    return {
      quote,
    }
  },
})
</script>

<template>
  <ArticleElement class="z-10" component="blockquote" kind="blockquote" :styles="styles">{{ quote }}</ArticleElement>
</template>
