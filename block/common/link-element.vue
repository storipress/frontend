<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    href: {
      type: String,
    },
  },
})
</script>

<template>
  <a @click.prevent><slot /></a>
</template>
