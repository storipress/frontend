<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue'

const props = withDefaults(defineProps<PrimitiveProps>(), {
  as: 'div',
})
</script>

<template>
  <Primitive v-bind="props" as-child draggable="true" @dragstart.prevent.stop>
    <slot />
  </Primitive>
</template>
