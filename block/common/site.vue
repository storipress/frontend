<script lang="ts">
import { computed, defineComponent } from 'vue'

import { useElement } from './common-element'

export default defineComponent({
  setup() {
    const element = useElement()
    return {
      site: computed(() => element.value.site),
    }
  },
})
</script>

<template>
  <div>
    <slot :site="site" />
  </div>
</template>
