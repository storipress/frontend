<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

import ColorArea from './color-area.vue'
import Spacing from './spacing.vue'
import type { BlockProp } from './use-block'
import { useBlock } from './use-block'

export default defineComponent({
  components: { ColorArea, Spacing },

  props: {
    /**
     * An required object for `Block`. Your block must accept a props called `block` and pass it to `Block`
     */
    block: {
      type: Object as PropType<BlockProp>,
      required: true,
    },

    backgroundColor: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
    },

    full: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    return useBlock(props)
  },
})
</script>

<template>
  <ColorArea
    ref="root"
    component="section"
    class="storipress-block relative transition-shadow duration-150"
    :class="blockClasses"
    :background-color="backgroundColor"
    :style="styles"
    @click="setSelected"
  >
    <Spacing :full="full">
      <!-- @slot block content -->
      <slot />
    </Spacing>
  </ColorArea>
</template>

<style lang="scss" scoped>
.highlight {
  transition: box-shadow 500ms ease-in-out 350ms;
}

.highlight-grow {
  box-shadow:
    0 1px 60px 0 rgb(0 0 0 / 10%),
    0 4px 40px 0 rgb(0 0 0 / 30%);
}
</style>
