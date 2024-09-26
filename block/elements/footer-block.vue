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
    const { insertAfter, ...blockData } = useBlock(props)

    return blockData
  },
})
</script>

<template>
  <ColorArea
    ref="root"
    component="section"
    class="storipress-block relative transition-shadow"
    :class="blockClasses"
    :background-color="backgroundColor"
    @click="setSelected"
  >
    <AddButton :order="block.order" variant="top" @click="insertBefore" />
    <!-- @slot block content -->
    <slot />
  </ColorArea>
</template>

<style lang="scss" scoped>
.highlight {
  transition: box-shadow 500ms ease-in-out 350ms;
}

.highlight-grow {
  box-shadow:
    0 1px 60px 0 rgba(0, 0, 0, 0.1),
    0 4px 40px 0 rgba(0, 0, 0, 0.3);
}
</style>
