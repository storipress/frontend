<script lang="ts">
import { header2 } from './preview-article'
import { Element } from './base'

export default defineComponent({
  mixins: [Element],
  setup() {
    return {
      header2,
    }
  },
})
</script>

<template>
  <ArticleElement component="h3" kind="h3" :styles="styles">{{ header2 }}</ArticleElement>
</template>
