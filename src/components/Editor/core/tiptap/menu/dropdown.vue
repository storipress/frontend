<script lang="ts" setup>
// Import necessary modules and types
import { computed } from 'vue'
import { Icon } from '@storipress/core-component'
import type { ActionableFormat, DropdownFormat } from './definitions'
import MenuIcon from './menu-icon.vue'
import MenuItem from './menu-item.vue'
import { OpenTransition } from '~/components/Transitions'
import { useTogglePopup } from '~/composables'

// Define component props
const props = defineProps<{
  activeBlock: string
  format: DropdownFormat
}>()

// Define component emits
const emit = defineEmits<(event: 'applyFormat', format: ActionableFormat) => void>()

// Compute the active format based on the active block and format options
const activeFormat = computed(
  () => props.format.options.find((format) => format.key === props.activeBlock) ?? props.format.options[0],
)

// Use the 'useTogglePopup' composable for handling the dropdown menu
const { open, reference, togglePopup, popup } = useTogglePopup({
  options: {
    placement: 'bottom',
  },
})

// Function to handle click events on the format options
function handleClick(format: ActionableFormat) {
  emit('applyFormat', format)
  open.value = false
}
</script>

<template>
  <!-- MenuItem component with a reference -->
  <MenuItem ref="reference">
    <!-- Button to toggle the dropdown menu -->
    <div class="flex items-center text-stone-500 dark:text-stone-200" role="button" @click="togglePopup">
      <!-- Display the name of the current block type -->
      <span class="text-body mr-1.5 whitespace-nowrap text-stone-500 dark:text-stone-200" v-text="activeFormat.name" />
      <!-- Icon for the dropdown menu -->
      <Icon icon-name="chevron_down" class="pt-0.5 text-[0.5rem]" />
    </div>

    <!-- Container for the dropdown menu -->
    <div ref="popup">
      <OpenTransition>
        <!-- Dropdown menu, only visible when 'open' is true -->
        <div
          v-if="open"
          class="mt-1 w-40 cursor-default overflow-hidden rounded-md bg-white py-1.5 pt-1 shadow-2-layer dark:bg-stone-800"
        >
          <!-- Header for the dropdown menu -->
          <div class="text-subheading mb-0.5 ml-4 mt-2 text-stone-400 dark:text-stone-200">Turn Into</div>

          <!-- List of format options for the dropdown menu -->
          <div
            v-for="f in format.options"
            :key="f.key"
            class="group/menu flex w-full items-center py-2 pl-4 pr-6 hover:bg-stone-100 hover:text-sky-600 dark:hover:bg-stone-700 dark:hover:text-sky-300"
            :class="{ 'text-sky-600': f.key === activeBlock }"
            role="button"
            @click="handleClick(f)"
          >
            <!-- Icon for each format option -->
            <MenuIcon class="mr-3" :format="f" />

            <!-- Name of each format option -->
            <span
              class="text-body whitespace-nowrap group-hover/menu:text-sky-600 dark:group-hover/menu:text-sky-300"
              :class="f.key === activeBlock ? 'text-sky-600' : 'text-stone-500 dark:text-stone-200'"
            >
              {{ f.name }}
            </span>
          </div>
        </div>
      </OpenTransition>
    </div>
  </MenuItem>
</template>
