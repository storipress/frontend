<!-- Invite collaborators button -->
<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
</script>

<template>
  <button class="ml-1.5 hidden flex-shrink-0 flex-grow-0 lg:flex">
    <div
      class="text-caption flex items-center justify-between rounded-full px-2 py-1 text-stone-400 transition-colors duration-150 hover:bg-stone-500/5 dark:text-stone-500 dark:hover:bg-stone-800"
    >
      <Icon class="mr-1.5 text-[0.5rem]" icon-name="plus" />
      Invite to story
    </div>
  </button>
</template>
