<script lang="ts" setup>
import { Icon } from '@iconify/vue'

defineProps({
  name: { type: String, default: '' },
  // skipcq: JS-0682
  icon: { type: String },
})
</script>

<template>
  <Icon :icon="icon ?? name" />
</template>
