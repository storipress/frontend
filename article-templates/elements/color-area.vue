<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, ref, toRef } from 'vue'
import { useArticleElement } from './inject'

export default defineComponent({
  props: {
    kind: {
      type: String,
    },
    component: {
      type: String,
      default: 'div',
    },
    disabled: {
      type: Boolean,
    },
    backgroundColor: {
      type: [String, Object] as PropType<string | Record<string, unknown> | null>,
    },
  },

  setup(props) {
    if (props.disabled) {
      return {
        root: ref(),
        picker: ref(),
        color: '',
      }
    }

    const element = useArticleElement()

    element.registerElementDefault(props.kind ? ['article', props.kind] : ['article'], {
      backgroundColor: props.backgroundColor,
    })

    return {
      scale: toRef(element, 'scale'),
    }
  },
})
</script>

<template>
  <component :is="component" ref="root" :class="kind" v-bind="$attrs">
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.color-picker-wrapper {
  [data-placement^='right'] & {
    @apply origin-top-right;
  }

  [data-placement^='bottom'] & {
    @apply origin-top;
  }
}
</style>
