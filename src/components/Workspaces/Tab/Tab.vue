<script setup lang="ts">
import { key } from '../definitions'

defineProps({
  tabKey: {
    type: String,
  },
})

const currentTeb = inject(key)
</script>

<template>
  <section v-show="currentTeb === tabKey" class="tabs-component-panel">
    <slot />
  </section>
</template>
