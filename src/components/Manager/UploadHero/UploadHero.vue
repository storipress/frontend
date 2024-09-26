<script lang="ts" setup>
import { Icon } from '@storipress/core-component'
import { debounce } from 'lodash'
import PhotoAlert from '../PhotoAlert'
import HoverModal from './HoverModal.vue'
import FocalImage from './FocalImage.vue'
import { initDragPoint } from './setting'
import { ImageUploading } from '~/components/Shared'
import type { TCoverCrop } from '~/pages/[clientID]/articles/[id]/edit/types'
import { imageSizeLimit } from '~/pages/[clientID]/articles/[id]/edit/setting'
import { OpenTransition } from '~/components/Transitions'
import { allowedImageTypeArray, isInvalidImage } from '~/utils/file'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'
import { RichInput } from '~/components/Editor/rich-input'

const props = defineProps<{
  coverUrl: string
  coverAlt: string
  coverCaption: string
  coverCrop: TCoverCrop
  callUnsplash: () => Promise<boolean>
  addCover: (uploadFile: File) => Promise<string>
  removeCover: () => void
  updateCoverAlt: (props: string) => void
  updateCoverCaption: (props: string) => void
}>()

const emit = defineEmits(['changeCover', 'updateArticle', 'updateCoverCrop'])
const nowImgUrlObj = computed(() => (props.coverUrl ? new URL(props.coverUrl) : undefined))
const previewImg = ref()
const imgRef = ref()
const heroCaption = ref()
const imgHintText = ref(['Upload or Drag', 'Hero'])
const tempImage = ref('')

const showFocal = ref<boolean>(false)
const dragPoint = ref(props.coverCrop ? { ...props.coverCrop } : { ...initDragPoint })
const isModalVisible = ref(false)

async function handleAddCover(e: Event) {
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
  await props.addCover(uploadFile)
  sendTrack('editor_hero_photo_added', {
    source: 'file',
  })
  if (tempImage.value) {
    URL.revokeObjectURL(tempImage.value)
    tempImage.value = ''
  }

  showFocal.value = false
}

async function handleDrop(e: DragEvent) {
  e.preventDefault()
  imgHintText.value = ['Drop to upload', 'Hero']

  if (e.dataTransfer?.files && e.dataTransfer?.files.length > 0) {
    const images = [...(e.dataTransfer?.files ?? [])]
      .filter((file) => /image/i.test(file.type))
      .filter((file) => {
        const imageType = file.type.split('/')[1]
        return allowedImageTypeArray.includes(imageType)
      })

    if (images.length === 0) {
      return
    }
    handleAddCover({ target: e.dataTransfer })
    imgHintText.value = ['Upload or Drag', 'Hero']
  }
}

function handleDragLeave() {
  imgHintText.value = ['Upload or Drag', 'Hero']
}

function handleRemoveCover() {
  props.removeCover()
}

async function handleUnsplash() {
  if (await props.callUnsplash()) {
    sendTrack('editor_hero_photo_added', {
      source: 'unsplash',
    })
  }
  showFocal.value = false
}

function handleAltUpdate() {
  props.updateCoverAlt(props.coverAlt)
}

function handleAltChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('changeCover', value, 'coverAlt', 'alt')
}

const handleCaptionUpdate = debounce(() => {
  props.updateCoverCaption(props.coverCaption)
}, 500)

function handleCaptionChange(value: string) {
  emit('changeCover', value, 'coverCaption', 'caption')
}

function selectFocal() {
  showFocal.value = true
  isModalVisible.value = false
  // add at here so we can safely use v-show if need in future
  sendTrack('editor_focal_point_view')
}

const initImg = computed(() => {
  return nowImgUrlObj.value
    ? `${nowImgUrlObj.value.origin}${nowImgUrlObj.value.pathname}?xlib=rb-1.2.1&q=80&cs=tinysrgb&fm=jpg&crop=entropy`
    : ''
})

function editFocal(point: TCoverCrop) {
  const coverCrop = {
    left: point.left,
    top: point.top,
    zoom: point.zoom,
    realWidth: point.realWidth,
    realHeight: point.realHeight,
  }
  if (nowImgUrlObj.value && nowImgUrlObj.value.host === 'images.unsplash.com') {
    const finalUrl = `${nowImgUrlObj.value.origin}${
      nowImgUrlObj.value.pathname
    }?xlib=rb-1.2.1&q=80&cs=tinysrgb&fm=jpg&crop=focalpoint&fp-x=${(point.left || 0) / 100}&fp-y=${
      (point.top || 0) / 100
    }&fp-z=${point.zoom}&fit=crop`
    emit('changeCover', finalUrl, 'coverUrl', 'url')
    emit('changeCover', coverCrop, 'coverCrop', 'crop')
    emit('updateCoverCrop')
  } else if (nowImgUrlObj.value) {
    const posX = Math.round((point.realWidth * point.left) / 100) - Math.round(point.width / 2)
    const posY = Math.round((point.realHeight * point.top) / 100) - Math.round(point.height / 2)
    const finalUrl = `${nowImgUrlObj.value.origin}${nowImgUrlObj.value.pathname}?crop=${Math.round(
      point.width,
    )},${Math.round(point.height)},${posX > 0 ? posX : 0},${posY > 0 ? posY : 0}`
    emit('changeCover', finalUrl, 'coverUrl', 'url')
    emit('changeCover', coverCrop, 'coverCrop', 'crop')
    emit('updateCoverCrop')
  }
  sendTrack('editor_focal_point_set')
}

// return a magic number to fit big image in widder and higher situation
const unsplashZoom = computed(() => {
  if (dragPoint.value.zoom <= 1) return 1

  if (dragPoint.value.width >= dragPoint.value.height) {
    return dragPoint.value.zoom + 1
  } else {
    return dragPoint.value.zoom * dragPoint.value.zoom
  }
})

const uploadZoomFactor = computed(() => {
  if (dragPoint.value.zoom >= 3) return 1.5
  return dragPoint.value.zoom < 1.5 ? 1 : dragPoint.value.zoom / 1.5
})

watch(
  () => props.coverCrop,
  (nowCrop) => {
    if (nowCrop) {
      dragPoint.value = { ...props.coverCrop }
    } else {
      dragPoint.value = { ...initDragPoint }
    }
  },
  { deep: true },
)

// unsplash img doesn't provide width and height, we need to load the image to get width and height
watch(nowImgUrlObj, (urlObj) => {
  if (urlObj?.host === 'images.unsplash.com' && (props.coverCrop.realHeight === 0 || props.coverCrop.realWidth === 0)) {
    const nowImgObj = computed(() => {
      const img = new Image()
      img.src = nowImgUrlObj.value ? `${nowImgUrlObj.value.origin}${nowImgUrlObj.value.pathname}` : ''
      return img
    })

    nowImgObj.value.onload = () => {
      dragPoint.value.realWidth = nowImgObj.value.naturalWidth
      dragPoint.value.realHeight = nowImgObj.value.naturalHeight
      const newCrop = { ...dragPoint.value }
      emit('changeCover', newCrop, 'coverCrop', 'crop')
      emit('updateCoverCrop')
    }
  }
})

onUpdated(() => {
  if (imgRef.value) {
    const scrollTopValue = Math.max(
      ((dragPoint.value.top || 0) / 100) * imgRef.value.height - 160 /* half of container height */,
      0,
    )
    const scrollLeftValue = Math.max(
      ((dragPoint.value.left || 0) / 100) * imgRef.value?.width - 360 /* half of container width */,
      0,
    )
    previewImg.value.scrollTop = scrollTopValue
    previewImg.value.scrollLeft = scrollLeftValue
  }
})
</script>

<template>
  <div class="flex flex-col" @mouseleave="isModalVisible = false">
    <div v-if="tempImage || coverUrl" class="flex h-80 w-full items-center justify-center">
      <span class="relative h-80 w-full md:w-[45rem]">
        <ImageUploading v-if="tempImage" class="rounded-lg" />
        <div ref="previewImg" class="h-80 w-full overflow-hidden rounded-lg md:w-[45rem]">
          <img
            v-if="!showFocal"
            :src="tempImage || coverUrl"
            class="size-full rounded-lg object-cover"
            :class="{
              'blur-sm': tempImage,
            }"
            @mouseover="isModalVisible = true"
          />
          <img
            v-else-if="nowImgUrlObj?.host === 'images.unsplash.com'"
            ref="imgRef"
            :src="initImg"
            class="zoom-image min-h-full min-w-full overflow-scroll rounded-lg object-cover"
            :style="{
              '--zoom-x': dragPoint.left,
              '--zoom-y': dragPoint.top,
              'max-height': `${20 * unsplashZoom}rem`,
              'max-width': `${45 * unsplashZoom}rem`,
            }"
            @scroll.stop
          />
          <img
            v-else
            ref="imgRef"
            :src="initImg"
            class="zoom-image-enlarge min-h-full min-w-full overflow-scroll rounded-lg object-cover"
            :style="{
              '--zoom-factor-enlarge': uploadZoomFactor,
              '--zoom-x': dragPoint.left,
              '--zoom-y': dragPoint.top,
              'max-height': `${20 * dragPoint.zoom}rem`,
              'max-width': `${45 * dragPoint.zoom}rem`,
            }"
          />
        </div>
        <div class="flex w-full items-center justify-center">
          <label
            v-if="!tempImage"
            for="uploadHeroLabel"
            class="absolute bottom-2 z-0"
            @mouseover="isModalVisible = true"
          >
            <PhotoAlert v-if="!coverAlt" alert-text="Missing alt text" />
          </label>
          <OpenTransition>
            <FocalImage
              v-if="showFocal"
              :img="coverUrl"
              :drag-point="dragPoint"
              @hide-focal="showFocal = false"
              @edit-focal="editFocal"
            />
          </OpenTransition>
        </div>
      </span>
      <HoverModal
        :is-modal-visable="isModalVisible"
        :has-uploaded="!!coverUrl"
        :cover-url="coverUrl"
        :cover-alt="coverAlt"
        :call-unsplash="handleUnsplash"
        :add-cover="handleAddCover"
        :select-focal="selectFocal"
        :remove-cover="handleRemoveCover"
        :update-alt="handleAltUpdate"
        :change-alt="handleAltChange"
        @mouseover="isModalVisible = true"
      />
    </div>
    <div
      v-else
      class="flex h-80 w-full items-center justify-center rounded-lg bg-stone-200 py-[7.25rem]"
      @mouseover="isModalVisible = true"
      @drop="handleDrop"
      @dragover="handleDrop"
      @dragleave="handleDragLeave"
    >
      <div class="flex items-center justify-center">
        <span class="flex space-x-3">
          <Icon class="text-[2.5rem] text-stone-400" icon-name="add_image" />
          <div class="text-body max-w-[5rem] text-stone-400">
            <div>{{ imgHintText[0] }} {{ imgHintText[1] }}</div>
          </div>
        </span>
        <HoverModal
          :is-modal-visable="isModalVisible"
          :has-uploaded="!!coverUrl"
          :cover-url="coverUrl"
          :cover-alt="coverAlt"
          :call-unsplash="handleUnsplash"
          :add-cover="handleAddCover"
          :select-focal="selectFocal"
          :remove-cover="handleRemoveCover"
          :update-alt="handleAltUpdate"
          :change-alt="handleAltChange"
        />
      </div>
    </div>
    <RichInput
      v-if="coverUrl"
      id="uploadHeroLabel"
      ref="heroCaption"
      :model-value="coverCaption"
      placeholder="Add hero photo caption"
      class="has-dark size-full p-2 focus:outline-none dark:text-white md:w-[45rem]"
      field-name="caption"
      @update:model-value="handleCaptionChange"
      @update:format="handleCaptionUpdate"
      @input="handleCaptionUpdate"
      @paste="handleCaptionUpdate"
      @click.stop
      @cut.stop
      @copy.stop
      @keydown.enter.stop
      @mouseover="isModalVisible = false"
    />
  </div>
</template>

<style scoped>
.zoom-image {
  transform-origin: calc(1% * var(--zoom-x, 50)) calc(1% * var(--zoom-y, 50));
}

.zoom-image-enlarge {
  transform: scale(calc(var(--zoom-factor-enlarge, 0)));
  transform-origin: calc(1% * var(--zoom-x, 50)) calc(1% * var(--zoom-y, 50));
}
</style>
