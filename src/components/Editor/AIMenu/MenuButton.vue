<script lang="ts" setup>
import { Icon } from '@storipress/core-component'

defineProps<{
  blockTitle: string
  nowTitle: string
  icon: string
}>()
</script>

<template>
  <button class="w-full px-3 py-1.5 transition-colors" :class="[blockTitle === nowTitle && 'bg-stone-100']">
    <span class="flex items-center space-x-2.5">
      <Icon
        class="text-[.75rem]"
        :class="[blockTitle === nowTitle ? 'text-sky-600' : 'text-stone-500']"
        :icon-name="icon"
      />
      <span class="text-body" :class="[blockTitle === nowTitle ? 'text-sky-600' : 'text-stone-500']">
        {{ blockTitle }}
      </span>
    </span>
  </button>
</template>
