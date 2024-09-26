<script lang="ts" setup>
defineProps({
  alertText: { type: String, default: '' },
})
</script>

<template>
  <div class="layer-1 w-fit rounded border border-stone-900/5 bg-white px-2 py-1">
    <div class="text-caption whitespace-nowrap text-stone-500">{{ alertText }}</div>
  </div>
</template>
