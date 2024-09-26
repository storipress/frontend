<script setup lang="ts">
import { Tooltip } from '@storipress/core-component'

withDefaults(
  defineProps<{
    to?: string
  }>(),
  {
    to: '',
  },
)
</script>

<template>
  <component
    :is="to ? 'a' : 'span'"
    :href="to"
    class="ml-2.5 text-sm"
    target="_blank"
    rel="noopener nofollow noreferrer"
    tabindex="-1"
  >
    <Tooltip>
      <div class="text-body w-56 px-4 py-3 text-stone-400">
        <slot> Click here for detailed information in the Storipress Help Center!</slot>
      </div>
    </Tooltip>
  </component>
</template>
