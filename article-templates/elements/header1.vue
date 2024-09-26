<script lang="ts">
import { header1 } from './preview-article'
import { Element } from './base'

export default defineComponent({
  mixins: [Element],
  setup() {
    return {
      content: header1,
    }
  },
})
</script>

<template>
  <ArticleElement component="h2" kind="h2" :styles="styles">{{ content }}</ArticleElement>
</template>
