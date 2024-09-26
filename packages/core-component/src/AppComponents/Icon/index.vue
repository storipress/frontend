<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'Icon',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    iconLeft: {
      type: Boolean,
      default: false,
    },
    iconRight: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const classes = computed(() => {
      return {
        [`icon-${props.iconName}`]: true,
        'is-left': props.iconLeft,
        'is-right': props.iconRight,
      }
    })
    return {
      classes,
      props,
    }
  },
})
</script>

<template>
  <span :class="classes" />
</template>

<style lang="scss" scoped>
.is {
  &-left {
    @apply mr-2;
  }
  &-right {
    @apply ml-2;
  }
}
</style>
