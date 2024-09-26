<script lang="ts" setup>
import { header1, header2, paragraphs, quote } from '@article-templates/elements/preview-article'

defineProps({
  value: { type: String, default: '' },
})
</script>

<template>
  <div>
    <p>{{ paragraphs[0] }}</p>
    <h1>{{ header1 }}</h1>
    <p>{{ paragraphs[1] }}</p>
    <blockquote>{{ quote }}</blockquote>
    <p>{{ paragraphs[2] }}</p>
    <h2>{{ header2 }}</h2>
    <p>{{ paragraphs[3] }}</p>
  </div>
</template>

<style lang="scss" scoped>
:deep(h1) {
  font-size: 32px;
}
:deep(h2) {
  font-size: 28px;
}
</style>
