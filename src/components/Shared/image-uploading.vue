<script lang="ts" setup>
import { LoadingSpinner } from '@storipress/core-component'
</script>

<template>
  <div class="absolute inset-0 z-[1] flex size-full flex-col items-center justify-center bg-stone-900/40">
    <LoadingSpinner show class="mb-6 flex items-center opacity-100" />
    <div class="text-body text-white">Uploading photo...</div>
  </div>
</template>
