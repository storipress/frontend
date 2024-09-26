<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import PhotoMenu from '../PhotoMenu/PhotoMenu.vue'
import type { PhotoButtonProps } from '../type'
import { imageSizeLimit } from '~/pages/[clientID]/articles/[id]/edit/setting'
import { ImageUploading } from '~/components/Shared'
import { allowedImageType, isInvalidImage } from '~/utils/file'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'

const props = defineProps({
  imageUrl: { type: String, default: '' },
  uploadImage: { type: Function, required: true },
  removeImage: { type: Function, required: true },
})
const tempImage = ref<string>('')
async function handleAddImage(e: Event) {
  const target = e?.target as HTMLInputElement
  const { open } = useRemoteDialog('error-notification')

  if (!target?.files) return
  const uploadFile = target.files?.[0]
  if (uploadFile.size > imageSizeLimit) {
    open({ type: 'imageLarge', size: uploadFile.size })
    return
  }

  if (await isInvalidImage(uploadFile)) {
    open({ type: 'imageUpload' })
    return
  }
  tempImage.value = URL.createObjectURL(uploadFile)
  await props.uploadImage(e)
  URL.revokeObjectURL(tempImage.value)
  tempImage.value = ''
}

const buttonArray: PhotoButtonProps[] = [
  {
    iconName: 'add_image',
    description: 'Replace photo',
    isUpload: true,
    onClick: (e: Event) => handleAddImage(e),
  },
  {
    iconName: 'delete',
    description: 'Remove photo',
    onClick: () => props.removeImage(),
  },
]

const isModalVisable = ref(false)
</script>

<template>
  <div
    v-if="tempImage || imageUrl"
    class="flex size-full items-center justify-center"
    @mouseover="isModalVisable = true"
    @mouseleave="isModalVisable = false"
  >
    <span v-if="tempImage || imageUrl" class="absolute h-[19.875rem] w-[93%] md:w-[43.75rem]">
      <ImageUploading v-if="tempImage" class="w-full rounded-lg" />
      <img :src="tempImage || imageUrl" class="size-full rounded-lg object-cover" :class="{ 'blur-sm': tempImage }" />
    </span>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isModalVisable && !tempImage"
        class="layer-2 absolute flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white"
      >
        <PhotoMenu :button-array="buttonArray" prefix="social" />
      </div>
    </transition>
  </div>
  <label v-else for="uploadArticleImage" class="flex h-full w-72 cursor-pointer items-center justify-center">
    <div for="uploadArticleImage" class="flex cursor-pointer items-center justify-center px-6">
      <div class="flex items-center justify-center space-x-4">
        <Icon class="text-[2.5rem] text-stone-200" icon-name="plus_circle_outline" />
        <div class="text-body text-stone-400">
          Add different social share photo. If left empty, defaults to hero image.
        </div>
      </div>
      <input id="uploadArticleImage" type="file" class="hidden" :accept="allowedImageType" @change="handleAddImage" />
    </div>
  </label>
</template>
