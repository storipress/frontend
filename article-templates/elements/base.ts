import { isUndefined, omitBy } from 'lodash-es'

import { styleProps } from './style-props'
import { BaseElement } from './inject'
import ArticleElement from './article-element.vue'

export { BaseElement }

export const Element = defineComponent({
  components: { ArticleElement },
  mixins: [BaseElement],

  props: {
    ...styleProps,
  },

  computed: {
    styles(): Record<string, unknown> {
      return omitBy(this.$props, isUndefined)
    },
  },
})
