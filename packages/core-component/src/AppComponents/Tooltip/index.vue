<script lang="ts">
import { defineComponent, ref } from 'vue'
import Icon from '../Icon/index.vue'
import { usePopper } from '../../composables'

export default defineComponent({
  name: 'Tooltip',
  components: {
    Icon,
  },
  props: {
    iconName: {
      type: String,
      default: 'question-mark-inverse',
    },
  },
  setup() {
    const show = ref(false)
    const { reference, popup } = usePopper(
      {
        placement: 'right-start',
      },
      show,
    )

    return { reference, popup, show }
  },
})
</script>

<template>
  <div class="inline">
    <Icon
      ref="reference"
      :icon-name="iconName"
      class="trigger cursor-pointer text-stone-400"
      aria-label="show-tooltip"
      @mouseover="show = true"
      @mouseleave="show = false"
    />
    <div
      ref="popup"
      class="tooltip layer-2 absolute rounded-md border border-stone-100 bg-white"
      :class="show ? 'visible' : 'invisible'"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tooltip {
  @apply w-max opacity-0 transition-opacity duration-75 ease-in-out;
}

.trigger:hover + .tooltip {
  @apply z-20 opacity-100 transition-opacity duration-75 ease-in-out;
}
</style>
