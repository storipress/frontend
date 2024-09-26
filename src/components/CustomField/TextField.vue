<script setup lang="ts">
import { Inputs as SpInput, Textarea as SpTextarea } from '@storipress/core-component'

withDefaults(
  defineProps<{
    label: string
    htmlName: string
    multiline?: boolean
  }>(),
  {
    multiline: false,
  },
)
</script>

<template>
  <SpTextarea v-if="multiline" :label="label" :textarea-name="htmlName" show-error class="min-w-[446px]" />
  <SpInput v-else :label="label" :html-name="htmlName" html-type="text" />
</template>

<style scoped></style>
