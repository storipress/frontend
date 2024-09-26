<script lang="ts">
import { computed, defineComponent } from 'vue'

import { styleProps } from './style-props'
import EditableInput from './editable-input.vue'
import { useEditableInput } from './use-editable-input'
import { useArticleElement } from './inject'
import ArticleElement from './article-element.vue'

export default defineComponent({
  components: { ArticleElement, EditableInput },

  props: {
    component: {
      type: String,
      default: 'figcaption',
    },
    ...styleProps,
  },

  setup(props) {
    const element = useArticleElement()
    const editableInput = useEditableInput('headlineCaption')

    return {
      element,

      styles: computed(() => {
        const { component, ...styles } = props
        return styles
      }),

      ...editableInput,
    }
  },
})
</script>
'

<template>
  <ArticleElement
    :component="component"
    kind="headline-caption"
    class="headline-caption"
    :styles="styles"
    v-bind="contentAttrs"
  >
    <EditableInput v-if="editable" field="headlineCaption" />
  </ArticleElement>
</template>
