<script lang="ts" setup>
import { cn } from '~/lib/cn'
</script>

<template>
  <div
    :class="
      cn([
        'z-[2] flex h-[calc(100vh-3.5rem)] w-60 flex-col border-r border-solid border-stone-200 bg-stone-100 pb-1 pl-[0.05rem] pr-2 pt-6',
        $attrs.class,
      ])
    "
  >
    <slot />
  </div>
</template>
