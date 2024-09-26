<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps<{ title: string }>()
</script>

<template>
  <div class="text-body flex py-4 dark:text-stone-300">
    <span class="grow">{{ title }}</span
    ><span><slot /></span>
  </div>
</template>
