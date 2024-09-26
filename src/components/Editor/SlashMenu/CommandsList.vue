<script lang="ts" setup>
// Import necessary components and types
import { Icon } from '@storipress/core-component'
import type { Editor } from '@tiptap/core'
import { BlockType } from '../core/utils'
import type { BlockItem, GroupItem } from './setting'
import TableOfContentIcon from './components/tableOfContentIcon.vue'
import { hideSlashAndAIMenu } from '~/components/Editor/utils'

// Define component props
const props = defineProps<{
  items: GroupItem[]
  editor: Editor
  command: (props: any) => void
}>()

// Define refs and computed properties
const slashRoot = ref<HTMLElement>()
const selectedIndex = ref(0)
const nowBlockIndex = ref(0)
const nowBlock = computed(() => {
  return props.items.filter((item) => item.blocks.length > 0)?.[nowBlockIndex.value]
})
const searchResult = computed(() => {
  return props.items.reduce((acc, item) => acc + item.blocks.length, 0)
})

// Filter out blocks with no commands
const filterNotFoundBlocks = computed(() => {
  return props.items.filter((item) => item.blocks.length > 0)
})

// Handle keydown events
function onKeyDown({ event }: { event: KeyboardEvent }) {
  // If doesn't have search results, do nothing
  if (!nowBlock.value) return

  // Handle arrow up, down and enter keys
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

// Handle up arrow key
function upHandler() {
  // If nowBlock is first, selectedIndex is first then set selectedIndex and nowBlockIndex to last
  if (selectedIndex.value === 0 && nowBlockIndex.value === 0) {
    nowBlockIndex.value = filterNotFoundBlocks.value.length - 1
    selectedIndex.value = filterNotFoundBlocks.value[nowBlockIndex.value].blocks.length - 1
    slashRoot.value?.scrollTo(0, 1000)
  } else if (selectedIndex.value === 0 && nowBlockIndex.value > 0) {
    // If selectedIndex is first and nowBlock is not first, move to previous block
    nowBlockIndex.value -= 1
    selectedIndex.value = filterNotFoundBlocks.value[nowBlockIndex.value].blocks.length - 1
  } else {
    // Otherwise, move to previous command in the same block
    selectedIndex.value = (selectedIndex.value + nowBlock.value.blocks.length - 1) % nowBlock.value.blocks.length
  }
  scrollHandler()
}

// Handle down arrow key
function downHandler() {
  // If nowBlock is last block, and selectedIndex is last index, scroll to top and reset index
  if (
    selectedIndex.value === nowBlock.value.blocks.length - 1 &&
    nowBlockIndex.value === filterNotFoundBlocks.value.length - 1
  ) {
    nowBlockIndex.value = 0
    selectedIndex.value = 0
    slashRoot.value?.scrollTo(0, 0)
  } else if (selectedIndex.value === nowBlock.value.blocks.length - 1) {
    // If selectedIndex is last index, scroll to next block and reset index
    selectedIndex.value = 0
    nowBlockIndex.value += 1
  } else {
    // Otherwise, move to next command in the same block
    selectedIndex.value = (selectedIndex.value + 1) % nowBlock.value.blocks.length
  }
  scrollHandler()
}

// Scroll to the selected command
function scrollHandler() {
  // 70 is block height, 90 is cross block height
  if (nowBlockIndex.value === 0) {
    // If nowBlock is first, scroll to a position based on selectedIndex
    slashRoot.value?.scrollTo(0, 70 * (selectedIndex.value - 6))
  } else if (nowBlockIndex.value > 0 && selectedIndex.value === 0) {
    // If nowBlock is not first and selectedIndex is first, scroll to a position based on nowBlockIndex
    slashRoot.value?.scrollTo(0, 90 * (selectedIndex.value + nowBlockIndex.value + 1))
  } else {
    // Otherwise, scroll to a position based on both nowBlockIndex and selectedIndex
    slashRoot.value?.scrollTo(0, 90 * nowBlockIndex.value + 70 * (selectedIndex.value + nowBlockIndex.value + 1))
  }
}

// Handle enter key
function enterHandler() {
  // Select the current command
  selectItem(nowBlock.value.blocks[selectedIndex.value])
}

// Execute the selected command
function selectItem(block: BlockItem) {
  props.command(block)
}

// Reset selectedIndex and nowBlockIndex when searchResult changes
watch(searchResult, () => {
  selectedIndex.value = 0
  nowBlockIndex.value = 0
})

// Expose onKeyDown method
defineExpose({
  onKeyDown,
})
</script>

<template>
  <div
    v-show="!hideSlashAndAIMenu(editor)"
    class="layer-2 w-[20rem] rounded-xl border border-stone-100 bg-white dark:border-stone-800 dark:bg-stone-800"
  >
    <!-- List of commands, visible only when there are search results -->
    <div v-if="searchResult > 0" ref="slashRoot" class="flex max-h-[28rem] flex-col overflow-y-auto">
      <!-- Loop through each block of commands -->
      <div
        v-for="(item, blockIndex) in filterNotFoundBlocks"
        :key="item.title"
        class="border-b-[1px] border-stone-200 px-1 pb-4 dark:border-stone-800"
      >
        <!-- Display the title of the block -->
        <div
          class="text-subheading mb-1.5 px-4 text-stone-500 dark:text-stone-200"
          :class="{ 'mt-4': blockIndex > 0, 'mt-2.5': blockIndex === 0 }"
        >
          {{ item.title }}
        </div>
        <!-- Loop through each command in the block -->
        <button
          v-for="(block, index) in item.blocks"
          :key="block.title"
          class="w-full rounded px-4 py-1.5 transition-colors duration-75 hover:bg-stone-100 dark:hover:bg-stone-700"
          :class="{ 'bg-stone-100 dark:bg-stone-700': index === selectedIndex && item.title === nowBlock.title }"
          @click="selectItem(block)"
        >
          <!-- Display the icon and details of the command -->
          <div class="flex items-center space-x-2.5">
            <div
              class="layer-0 flex items-center rounded-md border border-stone-200 bg-white p-2.5 dark:border-stone-300 dark:bg-stone-100/20 dark:invert"
            >
              <!-- Display the icon of the command -->
              <img v-if="item.title === 'Rich Media Embeds'" :src="block.iconName" class="size-6 dark:invert" />
              <template v-else-if="block.key === BlockType.tableOfContent">
                <TableOfContentIcon />
              </template>
              <Icon v-else class="text-[1.5rem]" :icon-name="block.iconName" />
            </div>
            <!-- Display the title and description of the command -->
            <div class="flex flex-col">
              <span class="text-body text-left text-stone-800 dark:text-stone-200">
                {{ block.title }}
              </span>
              <span class="text-caption text-left text-stone-400 dark:text-stone-400">
                {{ block.description }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
    <!-- Display 'No results' when there are no search results -->
    <div v-else class="text-subheading my-2.5 px-5 text-stone-500 dark:text-stone-200">No results</div>
  </div>
</template>

<style lang="scss"></style>
