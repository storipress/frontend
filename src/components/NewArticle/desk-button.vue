<script lang="ts" setup>
import { Icon } from '@storipress/core-component'

defineProps<{ active: boolean }>()
</script>

<template>
  <button
    class="flex max-w-xs items-center gap-1 rounded px-2 py-1 text-stone-600 focus:outline-none"
    :class="active ? 'layer-1 text-opacity-100' : 'border border-transparent bg-gray-100 text-opacity-75'"
  >
    <Icon class="text-[0.75rem]" icon-name="desk" /><span
      class="text-caption inline-block truncate whitespace-nowrap text-stone-600"
    >
      <slot />
    </span>
  </button>
</template>
