<!-- bold, underline, italic, link and comment buttons -->
<script lang="ts" setup>
import { defineProps } from 'vue'
import MenuItem from './menu-item.vue'
import MenuIcon from './menu-icon.vue'
import type { ActionFormat, ActionableFormat, StateFormat } from './definitions'

defineProps<{
  format: ActionFormat | StateFormat
  nodeState: Record<string, boolean>
}>()

defineEmits<(event: 'applyFormat', format: ActionableFormat) => void>()
</script>

<template>
  <MenuItem
    :class="`format-${format.key}`"
    :button-class="format.class"
    :active="nodeState[format.key]"
    @click="$emit('applyFormat', format)"
  >
    <MenuIcon :format="format" />
  </MenuItem>
</template>
