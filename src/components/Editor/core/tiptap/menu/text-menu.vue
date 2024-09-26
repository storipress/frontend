<script lang="ts" setup>
import MenuButton from './menu-button.vue'
import type { ActionableFormat } from './definitions'
import { textItems } from './definitions'
import Dropdown from './dropdown.vue'

defineProps<{
  activeBlock: string
  nodeState: Record<string, boolean>
}>()

defineEmits<(event: 'applyFormat', format: ActionableFormat) => void>()
</script>

<template>
  <div class="flex divide-x divide-stone-200 dark:divide-stone-600">
    <div v-for="(formats, i) of textItems" :key="i" class="group flex">
      <template v-for="format of formats">
        <Dropdown
          v-if="format.type === 'dropdown'"
          :key="`dropdown-${format.name}`"
          :active-block="activeBlock"
          :format="format"
          @apply-format="$emit('applyFormat', $event)"
        />
        <MenuButton
          v-else
          :key="`button-${format.name}`"
          :node-state="nodeState"
          :format="format"
          @apply-format="$emit('applyFormat', $event)"
        />
      </template>
    </div>
  </div>
</template>
