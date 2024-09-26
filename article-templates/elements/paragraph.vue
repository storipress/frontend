<script lang="ts">
import { constant, isUndefined, noop, omitBy } from 'lodash'
import { defineComponent } from 'vue'
import { paragraphs } from './preview-article'

import { Element } from './base'

export default defineComponent({
  mixins: [Element],
  inject: {
    registerContentElement: { default: constant(noop) },
  },

  props: {
    order: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    pseudoElements: [] as Function[],
  }),
  computed: {
    content(): string {
      return paragraphs[this.order]
    },
    styles(): Record<string, unknown> {
      const { order, ...styles } = this.$props
      return omitBy(styles, isUndefined)
    },
  },
  mounted() {
    this.$nextTick(() => {
      // ref: https://github.com/vuejs/core/issues/3031
      // @ts-expect-error type inference does not work
      this.pseudoElements = this.registerContentElement('p', this.$el)
    })
  },
})
</script>

<template>
  <ArticleElement component="p" kind="p" :pseudo-elements="pseudoElements" :styles="styles">{{
    content
  }}</ArticleElement>
</template>
