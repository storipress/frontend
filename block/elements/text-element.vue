<script lang="ts">
import { omit } from 'lodash'
import { defineComponent, warn } from 'vue'

import { styleProps } from '../utils/style-props'
import { BlockChild } from './base-element'
import GenericElement from './generic-element.vue'

export default defineComponent({
  components: { GenericElement },
  extends: BlockChild,

  inject: ['blockId'],

  props: {
    component: String,
    kind: String,
    blockType: String,
    ...styleProps,
  },

  computed: {
    genericElementProps() {
      return {
        ...omit(this.$props, ['kind', 'blockType']),
        display: 'Display Text',
        path: [`b-${this.blockId}`, this.kind as string],
      }
    },
  },

  created() {
    if (this.blockType) {
      warn('blockType is depercated')
    }
  },
})
</script>

<template>
  <GenericElement v-bind="genericElementProps">
    <slot />
  </GenericElement>
</template>
