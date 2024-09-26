<script lang="ts">
import { computed, defineComponent } from 'vue'

import { useArticleElement } from './inject'

export default defineComponent({
  setup() {
    const $element = useArticleElement()

    const logo = computed(() => $element.logo)

    return {
      logo,
    }
  },
})
</script>

<template>
  <img v-if="logo" :src="logo" alt="logo" />
</template>
