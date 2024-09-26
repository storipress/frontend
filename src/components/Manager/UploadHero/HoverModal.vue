<script lang="ts" setup>
import PhotoMenu from '../PhotoMenu/PhotoMenu.vue'
import type { PhotoButtonProps } from '../type'
import AltButton from '../AltButton/AltButton.vue'
import { useFeatureFlag } from '~/lib/feature-flag'

const props = defineProps<{
  isModalVisable: boolean
  hasUploaded: boolean
  coverUrl: string
  coverAlt: string
  callUnsplash: () => void
  addCover: (props: Event) => void
  removeCover: () => void
  selectFocal: () => void
  updateAlt: () => void
  changeAlt: (props: Event) => void
}>()

const enableFocal = useFeatureFlag('editor-focal-point')

const buttonArray = computed(() => {
  const initArray: PhotoButtonProps[] = [
    {
      iconName: 'add_image',
      description: 'Upload from computer',
      isUpload: true,
      onClick: (e: Event) => props.addCover(e),
    },
    {
      iconName: 'unsplash',
      description: 'Select from Unsplash',
      onClick: () => {
        props.callUnsplash()
      },
    },
  ]

  const hasFocalArray = [
    {
      iconName: 'focal_point',
      description: 'Select focal point',
      onClick: () => props.selectFocal(),
    },
    {
      iconName: 'delete',
      description: 'Remove photo',
      onClick: () => props.removeCover(),
    },
  ]

  const uploadedArray = [
    {
      iconName: 'delete',
      description: 'Remove photo',
      onClick: () => props.removeCover(),
    },
  ]

  return props.hasUploaded ? [...initArray, ...(enableFocal.value ? hasFocalArray : uploadedArray)] : initArray
})
</script>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div
      v-if="isModalVisable"
      class="layer-2 absolute flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white"
    >
      <PhotoMenu :button-array="buttonArray" prefix="hero" />
      <div
        v-if="hasUploaded"
        class="flex h-8 w-full items-center space-x-1 rounded-b-lg bg-stone-100 py-2 pl-2 pr-1 text-xs leading-tight"
      >
        <input
          id="uploadHeroLabel"
          placeholder="Enter alt Text"
          class="custom-input w-full bg-stone-100 focus:outline-none"
          :value="coverAlt || ''"
          @input="changeAlt"
          @blur="updateAlt"
        />
        <span class="ml-auto mr-0">
          <AltButton />
        </span>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.custom-input {
  &::placeholder {
    @apply font-light text-black text-opacity-25;
  }
}
</style>
