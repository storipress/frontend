<script lang="ts">
import { defineComponent } from 'vue'
import { Element } from './base'
import EditableInput from './editable-input.vue'
import { useEditableInput } from './use-editable-input'

export default defineComponent({
  components: { EditableInput },
  mixins: [Element],
  props: {
    kind: { type: String, default: 'article-description' },
  },
  setup() {
    return useEditableInput('blurb')
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
    component="p"
    :kind="kind"
    :class="kind"
    display="Article Description"
    :styles="styles"
    v-bind="contentAttrs"
  >
    <EditableInput v-if="editable" field="blurb" />
  </ArticleElement>
</template>
