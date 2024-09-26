<script lang="ts" setup>
import { Icon } from '@storipress/core-component'

defineEmits<{
  (event: 'clickPrevious'): void
  (event: 'clickNext'): void
  (event: 'clickToday'): void
}>()
</script>

<template>
  <div class="flex gap-x-px text-stone-800">
    <!-- left button -->
    <button
      class="flex h-7 items-center rounded-l-lg bg-stone-900/10 px-2 hover:bg-stone-900/20 hover:transition-colors hover:duration-75"
      @click="$emit('clickPrevious')"
    >
      <Icon class="text-xs" icon-name="chevron_left" />
    </button>
    <!-- back to today -->
    <button
      class="flex h-7 items-center bg-stone-900/10 px-4 hover:bg-stone-900/20 hover:transition-colors hover:duration-75"
      @click="$emit('clickToday')"
    >
      <span class="text-button">Today</span>
    </button>
    <!-- right button -->
    <button
      class="flex h-7 items-center rounded-r-lg bg-stone-900/10 px-2 hover:bg-stone-900/20 hover:transition-colors hover:duration-75"
      @click="$emit('clickNext')"
    >
      <Icon class="text-xs" icon-name="chevron_right" />
    </button>
  </div>
</template>
