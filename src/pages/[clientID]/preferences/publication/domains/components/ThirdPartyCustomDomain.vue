<script setup lang="ts">
import type { ManagedCustomDomainIntegration } from './custom-domain'
import { THIRD_PARTY_BANNER } from './custom-domain'

const props = defineProps<{ target: ManagedCustomDomainIntegration }>()

const banner = computed(() => THIRD_PARTY_BANNER[props.target])
</script>

<template>
  <div>
    <img class="m-auto w-16" :src="banner.logo" />

    <div class="mt-4 flex flex-col items-center gap-y-1">
      <span class="text-display-small text-stone-800">Connected to {{ banner.name }}</span>
      <span class="text-caption text-stone-500"
        >When integrated with {{ banner.name }}, {{ banner.name }} manages your custom domain</span
      >
    </div>
  </div>
</template>
