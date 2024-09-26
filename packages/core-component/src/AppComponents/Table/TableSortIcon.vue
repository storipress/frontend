<script setup lang="ts">
import Icon from '../Icon/index.vue'

defineProps<{ isDesc?: boolean }>()
</script>

<template>
  <Icon :icon-name="isDesc ? 'chevron_down' : 'chevron_up'" class="ml-[1.375rem] text-[0.6rem]" />
</template>
