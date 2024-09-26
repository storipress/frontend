<script lang="ts" setup>
import { defineEmits, ref } from 'vue'
import { Icon } from '@storipress/core-component'
import { ImageUploading } from '~/components/Shared'
import OpenTransition from '~/components/Transitions/open-transition.vue'

defineProps<{
  src: string
  uploading: boolean
  allUploaded: boolean
}>()

defineEmits<(event: 'remove', url: string) => void>()

const isModalVisible = ref(false)
</script>

<template>
  <div
    v-if="src"
    class="gallery-image relative h-full"
    @mouseover="isModalVisible = true"
    @mouseleave="isModalVisible = false"
  >
    <div v-if="uploading">
      <ImageUploading />
    </div>
    <OpenTransition>
      <div v-if="isModalVisible" class="absolute z-[2] flex size-full flex-col">
        <div
          v-if="isModalVisible && !uploading && allUploaded"
          role="button"
          class="layer-2 relative ml-auto mr-2 mt-2 flex items-center justify-center rounded-lg border border-gray-100 bg-white p-2"
          @click="$emit('remove', src)"
        >
          <Icon class="text-[1rem] text-stone-600" icon-name="delete" />
        </div>
      </div>
    </OpenTransition>
    <img
      class="transition-opacity duration-150"
      :class="{ 'opacity-100': !isModalVisible, 'opacity-50': isModalVisible && allUploaded }"
      :src="src"
      alt="img"
    />
  </div>
</template>
