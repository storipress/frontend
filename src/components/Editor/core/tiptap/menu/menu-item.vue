<!-- buttons background -->
<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'

withDefaults(defineProps<{ active?: boolean; buttonClass?: string }>(), { buttonClass: 'px-2.5' })
</script>

<template>
  <div
    class="relative flex h-full min-w-[2rem] items-center justify-center py-2.5 transition-colors duration-75 hover:bg-stone-100 group-first:first:rounded-l group-last:last:rounded-r [.has-dark_&]:dark:hover:bg-stone-700"
    :class="[
      active ? 'text-sky-600 [.has-dark_&]:dark:text-sky-400' : 'text-stone-500 [.has-dark_&]:dark:text-stone-200',
      buttonClass,
    ]"
    role="button"
  >
    <slot />
  </div>
</template>
