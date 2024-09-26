<script lang="ts">
import { defineComponent, watch } from 'vue'

import { useElement } from './base-element'
import Spacing from './spacing.vue'

export default defineComponent({
  components: { Spacing },

  props: {
    width: {
      type: [String, Object],
      default: 'auto',
    },
    max: {
      type: [String, Object],
    },
    min: {
      type: [String, Object],
    },
  },

  setup(props) {
    const $element = useElement()

    reportSpacing()

    watch(() => $element.value.version, reportSpacing, { immediate: true })

    function reportSpacing() {
      $element.value.setSpacing({
        width: props.width,
        max: props.max as any,
        min: props.min as any,
      })
    }
  },
})
</script>

<template>
  <Spacing>
    <slot />
  </Spacing>
</template>
