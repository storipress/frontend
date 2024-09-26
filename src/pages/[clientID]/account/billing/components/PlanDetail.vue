<script setup lang="ts">
import type { Plan } from './definitions'

defineProps<{
  plan: Plan
}>()
</script>

<template>
  <p v-if="plan.contentTitle" class="text-body mb-4 min-h-[1.25rem] font-bold">
    {{ plan.contentTitle }}
    <span class="font-normal">and:</span>
  </p>
  <ul>
    <li v-for="text in plan.list" :key="text" class="text-body mb-3 flex">
      <Icon icon-name="tick" class="mr-[0.625rem] text-xs text-emerald-700" />
      <p>{{ text }}</p>
    </li>
  </ul>
</template>
