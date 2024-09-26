<script lang="ts">
import { computed, defineComponent } from 'vue'

import { useElement } from '../base-element'

export default defineComponent({
  name: 'SearchLogo',

  setup() {
    const element = useElement()

    return {
      url: computed(() => {
        const hero = `b-${element.value.blocks[0]}`
        return (element.value.images[hero] as any)?.logo || (element.value.images['@@portal'] as any)?.menu?.logo
      }),
    }
  },
})
</script>

<template>
  <div class="placeholder">
    <div class="img-filter relative">
      <img class="size-full" :src="url" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.placeholder {
  @apply fixed bottom-8;
  @apply h-6 w-auto;

  left: 1.5rem;

  @screen md {
    left: 3.5rem;
  }
}

.img-filter {
  height: inherit;
  width: inherit;
  filter: grayscale(100%) invert(100%);
}
</style>
