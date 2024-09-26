<script lang="ts">
import { computed, defineComponent } from 'vue'

import Site from '../common/site.vue'
import { useElement } from './base-element'

export default defineComponent({
  components: { Site },

  setup() {
    const element = useElement()

    return {
      desks: computed(() => element.value.desks),
      pages: computed(() => element.value.pages),
    }
  },
})
</script>

<template>
  <Site v-slot="{ site }">
    <slot :site="site" :desks="desks" :pages="pages" />
  </Site>
</template>
