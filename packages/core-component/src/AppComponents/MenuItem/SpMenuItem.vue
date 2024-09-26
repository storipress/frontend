<!-- Item in dropdown menu -->
<script lang="ts" setup>
import { MenuItem as HMenuItem } from '@headlessui/vue'
import type { HTMLAttributes } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({
  name: 'SpMenuItem',
})

defineProps<{
  class?: HTMLAttributes['class']
  title?: string
  value?: boolean
}>()
</script>

<template>
  <HMenuItem v-slot="{ active }" :value="value">
    <div :class="[twMerge('block cursor-pointer py-2 pl-3.5 pr-8', $props.class), active ? 'bg-stone-100' : '']">
      <span>
        <slot />
      </span>
    </div>
  </HMenuItem>
</template>

<style lang="scss"></style>
