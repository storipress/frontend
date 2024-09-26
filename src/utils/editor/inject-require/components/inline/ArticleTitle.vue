<script lang="ts" setup>
defineProps({
  value: { type: String, default: '' },
})
</script>

<template>
  <h1>{{ value }}</h1>
</template>
