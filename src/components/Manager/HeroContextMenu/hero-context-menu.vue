<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import { Icon } from '@storipress/core-component'
import UnsplashIcon from '@assets/icons-unsplash.svg'
import AltButton from '../AltButton'
import type { PhotoButtonProps } from '../type'
import { allowedImageType } from '~/utils/file'

const props = defineProps<{
  uploaded?: boolean
}>()

const emit = defineEmits<{ (event: 'upload', file: File): void; (event: 'unsplash'): void; (event: 'remove'): void }>()

const initArray: PhotoButtonProps[] = [
  {
    iconName: 'add_image',
    description: 'Upload from computer',
    isUpload: true,
    onClick: (e: Event) => {
      const $el = e.target as HTMLInputElement
      emit('upload', $el.files?.[0] as File)
    },
  },
  {
    iconName: 'unsplash',
    description: 'Select from Unsplash',
    onClick: () => emit('unsplash'),
  },
]

const withDelete: PhotoButtonProps[] = [
  ...initArray,
  {
    iconName: 'delete',
    description: 'Remove photo',
    onClick: () => emit('remove'),
  },
]

const buttonArray = computed(() => {
  return props.uploaded ? withDelete : initArray
})
</script>

<template>
  <div class="layer-2 flex w-fit rounded">
    <div v-if="uploaded" class="flex bg-stone-100 p-1">
      <input
        placeholder="Enter Alt Text"
        class="text-caption bg-transparent p-1 text-[0.75rem] placeholder:text-stone-400 focus:outline-none"
      />
      <AltButton :clicked="false" disabled />
    </div>
    <div
      v-for="{ iconName, onClick, isUpload } in buttonArray"
      :key="iconName"
      class="flex bg-white transition-colors hover:bg-stone-100 hover:duration-75"
    >
      <component
        :is="isUpload ? 'label' : 'div'"
        class="flex w-full flex-col items-center justify-center p-2"
        role="button"
        @click="!isUpload && onClick()"
      >
        <img v-if="iconName === 'unsplash'" :src="UnsplashIcon" class="size-3" />
        <Icon v-else class="text-[0.75rem] text-stone-500" :icon-name="iconName" />
        <input v-if="isUpload" type="file" class="hidden" :accept="allowedImageType" @change="onClick" />
      </component>
    </div>
  </div>
</template>
