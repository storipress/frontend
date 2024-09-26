<script lang="ts">
import { computed, defineComponent, inject, warn } from 'vue'
import { omit } from 'lodash'

import { compositionStyleProps } from '../utils/style-props'
import GenericElement from './generic-element.vue'

export default defineComponent({
  components: { GenericElement },

  props: {
    component: String,
    kind: String,
    blockType: String,
    dataId: { type: String, default: null },
    defaultValue: String,

    ...compositionStyleProps,
  },

  setup(props) {
    if (props.blockType) {
      warn('blockType is deprecated')
    }

    const blockId = inject<string>('blockId') as string
    const genericElementProps = computed(() => {
      const path = [`b-${blockId}`, props.kind as string]
      return {
        ...omit(props, ['kind', 'blockType']),
        display: 'Input Text',
        editable: true,
        path,
        dataId: props.dataId,
      }
    })

    return {
      genericElementProps,
    }
  },
})
</script>

<template>
  <GenericElement v-bind="genericElementProps" />
</template>
