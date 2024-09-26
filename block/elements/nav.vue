<script lang="ts">
import { stubObject } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    height: {
      type: [Number, String, Object],
      default: stubObject,
    },
  },
})
</script>

<template>
  <nav class="nav">
    <slot />
  </nav>
</template>
