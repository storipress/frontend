<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, inject, onMounted, toRef } from 'vue'

// import { useColorPicker } from '../common/use-color-picker'
import { isNil, omitBy } from 'lodash'
import { useElement } from './base-element'

export default defineComponent({
  props: {
    kind: {
      type: String,
    },
    component: {
      type: String,
      default: 'div',
    },
    backgroundColor: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
    },
  },

  setup(props) {
    const blockId = inject<string>('blockId') as string
    const blockClass = `b-${blockId}`

    const path = props.kind ? [blockClass, props.kind] : [blockClass]

    const element = useElement()
    onMounted(() => {
      element.value.setElementStyle({
        path,
        data: omitBy(
          {
            backgroundColor: props.backgroundColor,
          },
          isNil,
        ),
        skipHistory: true,
        breakpoint: 'xs',
      })
    })

    return {
      scale: toRef(element.value, 'scale'),
      // ...useColorPicker({
      //   element,
      //   prefix: blockClass,
      //   kind: props.kind,
      //   backgroundColor: props.backgroundColor,
      // }),
    }
  },
})
</script>

<template>
  <component :is="component" ref="root" class="tippy-none" :class="kind" v-on="$attrs">
    <slot />
  </component>
</template>
