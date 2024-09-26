<script lang="ts" setup>
import type { PropType } from 'vue'
import { Icon } from '@storipress/core-component'
import type { PhotoButtonProps } from '../type'
import FormatUnsplash from './FormatUnsplash.vue'
import { allowedImageType } from '~/utils/file'

defineProps({
  prefix: { type: String, default: '' },
  buttonArray: { type: Array as PropType<PhotoButtonProps[]>, required: true },
})
</script>

<template>
  <div class="flex w-fit space-x-1 p-2">
    <div
      v-for="{ iconName, description, onClick, isUpload, isMultiple } in buttonArray"
      :key="`${prefix}-${iconName}`"
      class="flex h-24 w-[6.125rem] cursor-pointer rounded-lg hover:bg-stone-100 hover:duration-75"
    >
      <component
        :is="isUpload ? 'label' : 'div'"
        :for="isUpload ? `${prefix}-${iconName}-upload` : ''"
        class="flex w-full cursor-pointer flex-col items-center justify-center space-y-2 px-[.8rem] pb-2 pt-4"
        role="button"
        @click="!isUpload && onClick($event)"
      >
        <FormatUnsplash v-if="iconName === 'unsplash'" class="text-stone-600" />
        <Icon v-else class="text-[2rem] text-stone-600" :icon-name="iconName" />
        <input
          v-if="isUpload"
          :id="`${prefix}-${iconName}-upload`"
          type="file"
          class="hidden"
          :multiple="isMultiple"
          :accept="allowedImageType"
          @change="onClick"
        />
        <span class="text-caption text-center text-stone-400">{{ description }}</span>
      </component>
    </div>
  </div>
</template>

<style lang="scss"></style>
