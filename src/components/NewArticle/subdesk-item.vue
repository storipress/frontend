<script lang="ts" setup>
import { RadioGroupOption } from '@headlessui/vue'
import type { Desk } from './definitions'

defineProps<{
  item: Desk
}>()
</script>

<template>
  <RadioGroupOption v-slot="{ checked }" as="template" :value="item">
    <button
      class="text-body block w-full max-w-xs truncate py-2 pl-4 pr-8 text-left text-stone-800/75 focus:outline-none"
      :class="checked && 'bg-gray-100'"
    >
      {{ item.name }}
    </button>
  </RadioGroupOption>
</template>
