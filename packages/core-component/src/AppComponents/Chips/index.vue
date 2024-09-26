<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, reactive } from 'vue'
import { classname } from './classname'
import type { ChipsColor } from './definition'

export default defineComponent({
  name: 'Chip',

  props: {
    label: {
      type: String,
      required: true,
    },
    color: {
      type: String as PropType<ChipsColor>,
      validator: (value: string) => {
        return ['primary', 'info', 'warning'].includes(value)
      },
    },
    backgroundColor: {
      type: String,
    },
  },

  emits: ['click'],

  setup(props) {
    const classes = computed(() => {
      return props.color ? classname[props.color] : classname.default
    })
    const style = computed(() => {
      return { backgroundColor: props.backgroundColor }
    })
    props = reactive(props)
    return {
      classes,
      style,
    }
  },
})
</script>

<template>
  <span class="layer-0 text-body inline-flex items-center rounded-full px-2.5 py-0.5" :class="classes" :style="style">
    {{ label }}
  </span>
</template>

<style lang="scss" scoped></style>
