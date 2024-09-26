<script lang="ts">
import { defineComponent } from 'vue'
import { Element } from './base'
import EditableInput from './editable-input.vue'
import { useEditableInput } from './use-editable-input'

export default defineComponent({
  components: {
    EditableInput,
  },
  mixins: [Element],

  props: {
    kind: { type: String, default: 'article-title' },
  },

  setup() {
    return useEditableInput('title')
  },

  computed: {
    path(): string[] {
      return ['article', this.kind]
    },
  },
})
</script>

<template>
  <ArticleElement
    component="h1"
    :kind="kind"
    :class="kind"
    display="Article Title"
    :styles="styles"
    v-bind="contentAttrs"
  >
    <EditableInput v-if="editable" field="title" />
  </ArticleElement>
</template>
