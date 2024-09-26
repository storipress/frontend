<script setup lang="ts">
import { Icon, loadIcons } from '@iconify/vue'
import { useToggleColorMode } from '~/composables'

const { currentColorMode, icon, toggleColorMode } = useToggleColorMode()

onMounted(() => {
  loadIcons([
    'line-md:sunny-outline',
    'line-md:moon',
    'line-md:moon-to-sunny-outline-transition',
    'line-md:sunny-outline-to-moon-transition',
  ])
})
</script>

<template>
  <button
    :aria-label="currentColorMode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
    @click="toggleColorMode"
  >
    <Icon :key="icon" class="text-stone-800 dark:text-stone-200" width="16" height="16" :icon="icon" />
  </button>
</template>
