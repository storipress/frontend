<script setup lang="ts">
import { provideGraphContext } from './context'
const props = withDefaults(
  defineProps<{
    animation?: boolean
  }>(),
  {
    animation: true,
  },
)

const { animationEnd } = provideGraphContext(props)
</script>

<template>
  <div
    id="sp-graph"
    class="layer-1 flex flex-col rounded-lg bg-white pb-4 pr-4"
    role="img"
    :aria-label="animationEnd ? 'Charts that animation end' : 'Charts'"
  >
    <slot />
  </div>
</template>
