<script setup lang="ts">
import { Icon } from '@storipress/core-component'

defineProps({
  image: {
    type: String,
    default: undefined,
  },
  icon: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    default: '',
    require: true,
  },
  info: {
    type: String,
    default: '',
    require: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits<(event: 'onClick') => void>()
</script>

<template>
  <div
    role="button"
    class="layer-1 max-h-[5.8rem] w-full rounded bg-white pb-[0.875rem] pl-3 pr-8 pt-4 duration-100 ease-in-out"
    :class="[disabled ? 'opacity-50 hover:cursor-not-allowed hover:shadow-0-layer' : 'hover:layer-2 hover:bg-gray-100']"
    @click="$emit('onClick')"
  >
    <div class="flex items-center">
      <slot name="icon">
        <div class="mr-4 flex min-h-[2.5rem] min-w-[2.5rem] items-center justify-center">
          <img v-if="image" :src="image" class="size-8" />
          <Icon v-else-if="icon" :icon-name="icon" class="text-[2rem] text-gray-600" />
        </div>
      </slot>
      <div>
        <div class="mb-0.5 truncate">{{ title }}</div>
        <div class="text-caption text-stone-400">{{ info }}</div>
      </div>
    </div>
  </div>
</template>
