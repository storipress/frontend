<script lang="ts">
import { defineComponent } from 'vue'
import { BaseElement } from './base-element'

export default defineComponent({
  extends: BaseElement,
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<template>
  <div :class="full ? null : 'spacing'">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.spacing {
  @apply mx-auto;
}
</style>
