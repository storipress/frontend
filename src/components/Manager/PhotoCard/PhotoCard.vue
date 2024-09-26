<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import { useId } from 'radix-vue'
import PhotoAlert from '../PhotoAlert'
import type { PhotoButtonProps } from '../type'
import AltButton from '../AltButton/AltButton.vue'
import PhotoMenu from '../PhotoMenu/PhotoMenu.vue'
import NoDragging from '~/components/NoDragging.vue'
import { OpenTransition } from '~/components/Transitions'
import { RichInput } from '~/components/Editor/rich-input'
import MenuLink from '~/components/Manager/MenuLink'
import { isInvalidImage } from '~/utils/file'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'
import { imageSizeLimit } from '~/pages/[clientID]/articles/[id]/edit/setting'
import { ImageUploading } from '~/components/Shared'

const props = defineProps({
  img: { type: String, default: '' },
  tmpImg: { type: String, default: '' },
  alt: { type: String, default: '' },
  style: { type: String, default: '' },
  imgType: { type: String, default: 'regular' },
  caption: { type: String, default: '' },
  link: { type: String, default: '' },
  uploadImg: { type: Function, required: true },
  removeImg: { type: Function, required: true },
  callUnsplash: { type: Function, required: true },
  updateAlt: { type: Function, required: true },
  updateCaption: { type: Function, required: true },
  updateType: { type: Function, required: true },
  updateLink: { type: Function, required: true },
})
const pictureID = useId(undefined, 'sp-photo-alt')
const nowImg = ref<string>(props.img)
const nowAlt = ref<string>(props.alt)
const nowCaption = ref<string>(props.caption)
const savedLink = ref<string>(props.link)
const tmpLink = ref<string>(props.link)
const isCaption = ref<boolean>(true)

async function uploadProcess(e: Event) {
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
  nowImg.value = await props.uploadImg(uploadFile)
}
const buttonArray = computed(() => {
  const initArray: PhotoButtonProps[] = [
    {
      iconName: 'add_image',
      description: 'Upload from computer',
      isUpload: true,
      onClick: uploadProcess,
    },
    {
      iconName: 'unsplash',
      description: 'Select from Unsplash',
      onClick: async () => {
        const res = await props.callUnsplash()
        nowImg.value = res?.src ?? ''
      },
    },
    {
      iconName: 'delete',
      description: 'Remove card',
      onClick: (e: Event) => {
        e.stopPropagation()
        props.removeImg()
        nowImg.value = ''
      },
    },
  ]

  const uploadedArray: PhotoButtonProps[] = [
    {
      iconName: 'justify_fit',
      description: 'Fit',
      onClick: () => {
        props.updateType('regular')
      },
    },
    {
      iconName: 'justify_expand',
      description: 'Expand',
      onClick: () => {
        props.updateType('wide')
      },
    },
    {
      iconName: 'justify_fill',
      description: 'Max-Screen',
      onClick: () => {
        props.updateType('full-width')
      },
    },
    {
      iconName: 'add_image',
      isUpload: true,
      description: 'Swap photo',
      onClick: uploadProcess,
    },
    {
      iconName: 'delete',
      description: 'Delete',
      onClick: (e: Event) => {
        e.stopPropagation()
        props.removeImg()
        nowImg.value = ''
      },
    },
  ]
  return nowImg.value ? uploadedArray : initArray
})

function handleAltUpdate() {
  props.updateAlt(nowAlt.value)
}

function handleCaptionUpdate() {
  props.updateCaption(nowCaption.value)
}

watch(props, (newProps) => {
  nowImg.value = newProps.img
  nowAlt.value = newProps.alt
  savedLink.value = newProps.link
  tmpLink.value = newProps.link
  nowCaption.value = newProps.caption
})

const isModalVisible = ref(false)
const isLinkVisible = ref(false)
const linkButton = ref<HTMLElement>()

function addLink() {
  props.updateLink(tmpLink.value)
  isLinkVisible.value = false
}

function deleteLink() {
  props.updateLink('')
  savedLink.value = ''
  tmpLink.value = ''
}

onClickOutside(linkButton, () => {
  if (isLinkVisible.value) {
    isLinkVisible.value = false
    props.updateLink(tmpLink.value)
  }
})
</script>

<template>
  <figure v-if="nowImg || tmpImg" class="flex flex-col items-center justify-center">
    <span class="relative w-full cursor-grab">
      <div v-if="tmpImg">
        <ImageUploading />
        <img :src="tmpImg" class="size-full blur-sm" />
      </div>
      <div v-else class="space-y-1">
        <div
          class="flex flex-col items-center justify-center"
          @mouseover="isModalVisible = true"
          @mouseleave="isModalVisible = false"
        >
          <img :src="nowImg" class="h-full" :style="style" />
          <div class="absolute items-center justify-center space-y-1">
            <OpenTransition>
              <div
                v-if="isModalVisible"
                class="layer-2 z-[2] rounded-lg border border-gray-100 bg-white"
                :class="{ visible: isModalVisible, invisible: !isModalVisible }"
              >
                <PhotoMenu :button-array="buttonArray" prefix="hero" />
                <figcaption
                  class="flex w-full cursor-text items-center space-x-1 rounded-b-lg bg-stone-100 py-1 pl-1.5 pr-1 text-xs leading-tight"
                  @mousedown.stop
                >
                  <NoDragging>
                    <div class="custom-input grid w-full grid-cols-1 grid-rows-1">
                      <!-- add max-w-[10px] because safari will has bug if only use max-w-fit -->
                      <div
                        class="invisible col-start-1 col-end-2 row-start-1 min-w-full max-w-fit whitespace-pre-wrap break-all"
                      >
                        {{ `${nowAlt} ` }}
                      </div>
                      <textarea
                        :id="pictureID"
                        v-model="nowAlt"
                        placeholder="Enter alt text …"
                        rows="1"
                        class="col-start-1 col-end-2 row-start-1 min-w-full max-w-full resize-none overflow-hidden whitespace-pre-wrap break-all bg-stone-100 placeholder:font-light placeholder:text-black placeholder:text-opacity-25 focus:outline-none"
                        @input="handleAltUpdate"
                        @click.stop
                        @cut.stop
                        @copy.stop
                        @paste.stop
                        @keydown.enter.stop
                      />
                    </div>
                  </NoDragging>
                  <div class="mb-auto">
                    <AltButton
                      :clicked="false"
                      :disabled="true"
                      class="z-[2]"
                      @handle-alt-click="isCaption = !isCaption"
                    />
                  </div>
                </figcaption>
              </div>
            </OpenTransition>
          </div>
          <div class="mt-[-2rem] flex items-center justify-center">
            <label :for="pictureID" @mousedown="isCaption = false">
              <PhotoAlert
                alert-text="Missing alt text"
                :class="{ visible: !nowAlt && nowImg, invisible: nowAlt || !nowImg }"
              />
            </label>
            <div ref="linkButton" class="absolute right-2.5 flex items-center justify-center" role="button">
              <div
                data-testid="link-button"
                class="flex size-6 items-center justify-center rounded-full bg-white"
                @click="isLinkVisible = !isLinkVisible"
              >
                <Icon
                  class="text-[.75rem]"
                  icon-name="link_variant"
                  :class="savedLink ? 'text-sky-600' : 'text-stone-600'"
                />
              </div>
              <OpenTransition>
                <div
                  v-if="isLinkVisible"
                  class="absolute top-10 z-[1]"
                  :class="{ visible: isLinkVisible, invisible: !isLinkVisible }"
                >
                  <NoDragging>
                    <MenuLink
                      v-model="tmpLink"
                      @mousedown.stop
                      @click.stop
                      @cut.stop
                      @copy.stop
                      @paste.stop
                      @change="addLink"
                      @delete="deleteLink"
                    />
                  </NoDragging>
                </div>
              </OpenTransition>
            </div>
          </div>
        </div>
        <!-- use w-[93vw] because use 100vw will exceed the image width -->
        <figcaption
          class="flex w-full cursor-text items-center space-x-1 pb-1 pt-3 text-xs leading-tight"
          @mousedown.stop
        >
          <div class="custom-input grid w-full grid-cols-1 grid-rows-1">
            <!-- add max-w-[10px] because safari will has bug if only use max-w-fit -->
            <NoDragging>
              <RichInput
                v-model="nowCaption"
                data-testid="richCaption"
                placeholder="Enter a photo caption …"
                class="has-dark col-start-1 col-end-2 row-start-1 min-w-full max-w-fit whitespace-pre-wrap break-words transition-colors dark:text-white"
                @input="handleCaptionUpdate"
                @paste="handleCaptionUpdate"
                @update:format="handleCaptionUpdate"
                @cut.stop
                @copy.stop
                @click.stop
                @keydown.enter.stop
              />
            </NoDragging>
          </div>
        </figcaption>
      </div>
    </span>
  </figure>
  <figure
    v-else
    class="flex h-80 w-full flex-col"
    @mouseover="isModalVisible = true"
    @mouseleave="isModalVisible = false"
  >
    <div class="flex size-full items-center justify-center border border-stone-200 bg-stone-50">
      <span class="flex flex-col items-center space-y-2">
        <Icon class="text-[2.5rem] text-stone-600" icon-name="add_image" />
        <div class="text-caption flex flex-col items-center text-stone-400">
          <div>Upload from</div>
          <div>computer</div>
        </div>
      </span>

      <OpenTransition>
        <div
          v-if="isModalVisible && !tmpImg"
          class="layer-2 absolute flex flex-col rounded-lg border border-gray-100 bg-white"
        >
          <PhotoMenu :button-array="buttonArray" prefix="hero" />
        </div>
      </OpenTransition>
    </div>
  </figure>
</template>

<style lang="scss" scoped>
.custom-input {
  > div {
    @apply max-w-[10px];
  }
}
</style>
