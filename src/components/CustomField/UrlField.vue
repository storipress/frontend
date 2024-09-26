<script setup lang="ts">
import { Inputs as SpInput } from '@storipress/core-component'

defineProps<{
  label: string
  htmlName: string
}>()
</script>

<template>
  <SpInput :label="label" :html-name="htmlName" html-type="url" />
</template>

<style scoped></style>
