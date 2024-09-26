<script lang="ts">
import { Element } from './base'

export default defineComponent({
  mixins: [Element],
})
</script>

<template>
  <ArticleElement component="span" kind="author-name" class="author-name" :styles="styles"><slot /></ArticleElement>
</template>
