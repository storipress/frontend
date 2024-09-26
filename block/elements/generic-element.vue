<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, onMounted, toRef } from 'vue'
import { isNil, omitBy } from 'lodash'

import { useElement } from './base-element'
import { usePath } from './use-path'

export default defineComponent({
  props: {
    component: String,
    display: String,
    path: {
      type: Array as PropType<string[]>,
      required: true,
    },
    editable: { type: Boolean, default: undefined },
    defaultValue: String,

    fontSize: [Number, Object],
    fontFamily: [String, Object],
    bold: { type: [Boolean, Object], default: undefined },
    italic: { type: [Boolean, Object], default: undefined },
    underline: { type: [Boolean, Object], default: undefined },
    uppercase: { type: [Boolean, Object], default: undefined },
    lowercase: { type: [Boolean, Object], default: undefined },
    align: [String, Object],
    color: [String, Object],
    lineHeight: [Number, Object],
    hoverColor: [String, Object],
  },

  setup(props) {
    const element = useElement()
    const { path, kind, stylePath } = usePath(toRef(props, 'path'))

    onMounted(() => {
      const {
        align,
        bold,
        color,
        fontFamily,
        fontSize,
        italic,
        lineHeight,
        lowercase,
        underline,
        uppercase,
        hoverColor,
      } = props

      const data = omitBy(
        {
          align,
          bold,
          color,
          fontFamily,
          fontSize,
          italic,
          lineHeight,
          lowercase,
          underline,
          uppercase,
          hoverColor,
        },
        isNil,
      )

      if (Object.keys(data).length === 0) {
        return
      }

      element.value.setElementStyle({
        path: stylePath.value,
        breakpoint: 'xs',
        skipHistory: true,
        data,
      })
    })

    if (props.defaultValue != null) {
      element.value.setElementText({ path: path.value, data: props.defaultValue, noOverride: true, skipHistory: true })
    }

    return {
      kind,
    }
  },
})
</script>

<template>
  <component :is="component" v-if="defaultValue" class="element" :class="kind">
    {{ defaultValue }}
  </component>
  <component :is="component" v-else class="element" :class="kind">
    <slot />
  </component>
</template>
