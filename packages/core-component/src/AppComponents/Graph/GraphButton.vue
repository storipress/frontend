<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    active: boolean
  }>(),
  {
    active: false,
  },
)
const emit = defineEmits<{ click: [MouseEvent] }>()
</script>

<template>
  <button
    class="cursor-pointer text-right text-sm text-stone-400"
    :class="[{ active: props.active }]"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.active {
  @apply font-bold text-stone-700;
}
</style>
