<script lang="ts">
import { defineComponent } from 'vue'

import SwappableImage from './swappable-image.vue'

export default defineComponent({
  components: { SwappableImage },
  props: {
    kind: {
      type: String,
      default: 'logo',
    },
  },

  data: () => ({
    logo: 'https://assets.stori.press/storipress/sp-placeholder.svg',
  }),
})
</script>

<template>
  <SwappableImage :kind="kind" :default-value="logo" alt="logo" />
</template>
