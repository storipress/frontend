<script lang="ts" setup>
defineProps({
  value: { type: String, default: '' },
})
</script>

<template>
  <p>{{ value }}</p>
</template>
