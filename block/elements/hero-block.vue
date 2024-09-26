<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

import ColorArea from './color-area.vue'
import type { BlockProp } from './use-block'
import { useBlock } from './use-block'

export default defineComponent({
  components: { ColorArea },

  props: {
    /**
     * An required object for `Block`. Your block must accept a props called `block` and pass it to `Block`
     */
    block: {
      type: Object as PropType<BlockProp>,
      required: true,
    },

    backgroundColor: {
      type: [String, Object],
    },
  },

  setup(props) {
    const { insertBefore, ...blockData } = useBlock(props)

    return blockData
  },
})
</script>

<template>
  <ColorArea
    ref="root"
    component="section"
    class="storipress-block relative transition-shadow duration-150"
    :class="blockClasses"
    :style="styles"
    :background-color="backgroundColor"
    @click="setSelected"
  >
    <!-- @slot block content -->
    <slot />
  </ColorArea>
</template>

<style lang="scss" scoped>
.highlight {
  @apply max-h-0 opacity-0;

  transition: box-shadow 500ms ease-in-out 350ms;
  animation: highlight 500ms ease-in-out forwards;
}

.highlight-grow {
  box-shadow:
    0 1px 60px 0 rgba(0, 0, 0, 0.1),
    0 4px 40px 0 rgba(0, 0, 0, 0.3);
}

@keyframes highlight {
  from {
    max-height: 0;
    opacity: 0;
  }

  50% {
    max-height: 64rem;
    opacity: 0;
  }

  to {
    max-height: 64rem;
    opacity: 100;
  }
}
</style>
