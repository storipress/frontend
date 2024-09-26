<script lang="ts" setup>
const props = defineProps({
  disabled: { type: Boolean, default: true },
  clicked: { type: Boolean, default: false },
})
const emit = defineEmits(['handleAltClick'])
function handleAltClick() {
  emit('handleAltClick', !props.clicked)
}
</script>

<template>
  <button
    class="layer-1 w-fit rounded border px-1.5 py-1"
    :class="{
      'border-stone-400 bg-stone-400/10 transition-colors duration-75 ease-out': clicked,
      'border-sky-600 bg-sky-600/10 transition-colors duration-75 ease-in': !clicked,
    }"
    :disabled="disabled"
    @click.stop="handleAltClick"
  >
    <div class="text-caption whitespace-nowrap" :class="{ 'text-stone-400': clicked, 'text-sky-600': !clicked }">
      Alt
    </div>
  </button>
</template>

<style lang="scss"></style>
