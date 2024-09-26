<script setup lang="ts">
import { Icon } from '@storipress/core-component'
import type { PropType } from 'vue'

defineProps({
  image: {
    type: String as PropType<string | null>,
  },
  title: {
    type: String,
    require: true,
  },
  info: {
    type: String,
    require: true,
  },
  highlightInvited: {
    type: Boolean,
    default: false,
  },
})

defineEmits<(event: 'onClickCard') => void>()
</script>

<template>
  <div
    role="button"
    class="layer-1 relative flex h-[4.75rem] w-full items-center justify-between rounded bg-white pl-5 pr-[1.625rem] duration-100 ease-in-out hover:layer-2 hover:bg-gray-50"
  >
    <span v-if="highlightInvited" class="absolute right-0 top-0 -mr-1 -mt-1 flex size-3 animate-ping">
      <span class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-800 opacity-75"></span>
      <span class="relative inline-flex size-3 rounded-full bg-emerald-700"></span>
    </span>
    <div class="flex">
      <img v-if="image" :src="image" class="mr-4 size-10 rounded-full" />
      <div v-else class="mr-4 flex size-10 items-center justify-center rounded-full bg-gray-100">
        <Icon icon-name="publication" class="text-[1.125rem] text-gray-400" />
      </div>
      <div>
        <div class="mb-1.5 max-w-[18rem] truncate">{{ title }}</div>
        <div class="text-caption text-stone-400">{{ info }}</div>
      </div>
    </div>
    <Icon icon-name="chevron_right" class="text-stone-600" />
  </div>
</template>

<style scoped></style>
