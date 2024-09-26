<script lang="ts">
import { Element } from './base'

export default defineComponent({
  mixins: [Element],
})
</script>

<template>
  <ArticleElement component="article" kind="article-author" class="article-author" :styles="styles">
    <slot />
  </ArticleElement>
</template>
