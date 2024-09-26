<script lang="ts" setup>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { onClickOutside } from '@vueuse/core'
import type { TCoverCrop } from '~/pages/[clientID]/articles/[id]/edit/types'
import { useFeatureFlag } from '~/lib/feature-flag'

const props = defineProps<{
  img: string
  dragPoint: TCoverCrop
}>()

const emits = defineEmits<{
  (event: 'editFocal', dragPoint: TCoverCrop): void
  (event: 'hideFocal'): void
}>()

const initImg = computed(() => {
  const imgUrl = new URL(props.img)
  return `${imgUrl.origin}${imgUrl.pathname}?xlib=rb-1.2.1&q=80&cs=tinysrgb&fm=jpg&crop=entropy`
})
const { dragPoint } = toRefs(props)
const wrapperRef = ref(null)
const mouseMoveImg = ref(null)
const enableSlide = useFeatureFlag('editor-focal-point-zoom')
const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(mouseMoveImg)
const { pressed } = useMousePressed({ target: mouseMoveImg })
const HANDLE_SIZE_IN_PX = 40

function ovalLength(nowX: number, nowY: number) {
  const xPos = Math.abs(nowX - elementWidth.value / 2)
  const yPos = Math.abs(elementHeight.value / 2 - nowY)
  const ovalLength =
    xPos ** 2 / (elementWidth.value / 2 - 80 * (elementWidth.value / dragPoint.value.realWidth)) ** 2 +
    yPos ** 2 / (elementHeight.value / 2 - 80 * (elementHeight.value / dragPoint.value.realHeight)) ** 2
  return ovalLength
}

function autoZoomRange(length: number) {
  const ans = Number((length * 9).toFixed(4))
  return ans > 3 ? 3 : ans
}

function handleMouseMove() {
  if (pressed.value && !isOutside.value) {
    const nowX = ref(elementX.value)
    const nowY = ref(elementY.value)

    let times = 0
    while (ovalLength(nowX.value, nowY.value) > 1) {
      if (times > 5000) {
        break
      }
      if (nowX.value > elementWidth.value / 2) {
        nowX.value -= 0.01
      } else {
        nowX.value += 0.01
      }

      if (elementHeight.value / 2 > nowY.value) {
        nowY.value += 0.01
      } else {
        nowY.value -= 0.01
      }
      times += 1
    }

    dragPoint.value.zoom = autoZoomRange(ovalLength(nowX.value, nowY.value))
    dragPoint.value.left = (nowX.value / elementWidth.value) * 100
    dragPoint.value.top = (nowY.value / elementHeight.value) * 100

    dragPoint.value.width = dragPoint.value.realWidth / dragPoint.value.zoom
    dragPoint.value.height = dragPoint.value.realHeight / dragPoint.value.zoom
  }
}
function handleSliderChange(zoom: number) {
  dragPoint.value.zoom = zoom
  dragPoint.value.width = dragPoint.value.realWidth / dragPoint.value.zoom
  dragPoint.value.height = dragPoint.value.realHeight / dragPoint.value.zoom
}

const imgLoaded = ref(false)

onClickOutside(wrapperRef, () => {
  dragPoint.value.width = dragPoint.value.realWidth / dragPoint.value.zoom
  dragPoint.value.height = dragPoint.value.realHeight / dragPoint.value.zoom
  emits('editFocal', dragPoint.value)
  emits('hideFocal')
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="img-wrappger layer-1 absolute w-full rounded-lg"
    :style="{
      top: '80px',
      left: '720px',
      transform: 'translateX(-25%)',
    }"
  >
    <div class="pointer-events-none absolute size-full rounded-lg bg-stone-900/30" />
    <img
      ref="mouseMoveImg"
      draggable="false"
      :src="initImg"
      class="max-h-[10rem] min-h-full min-w-full max-w-[30rem] rounded-lg"
      @mousemove="handleMouseMove"
      @load="imgLoaded = true"
    />

    <div
      v-show="imgLoaded"
      class="absolute overflow-hidden rounded-full border border-white"
      :class="{ 'cursor-move': pressed, 'pointer-events-none': !pressed }"
      :style="{
        left: `${dragPoint.left - (HANDLE_SIZE_IN_PX / 2 / elementWidth) * 100}%`,
        top: `${dragPoint.top - (HANDLE_SIZE_IN_PX / 2 / elementHeight) * 100}%`,
        width: `${HANDLE_SIZE_IN_PX}px`,
        height: `${HANDLE_SIZE_IN_PX}px`,
      }"
      @mousemove="handleMouseMove"
    >
      <div class="size-full bg-white mix-blend-overlay" />
    </div>
    <div v-if="enableSlide" class="absolute bottom-0 flex w-full items-center justify-center">
      <vue-slider
        v-if="elementWidth > 0"
        v-model="dragPoint.zoom"
        absolute
        :width="elementWidth / 2"
        tooltip="none"
        :min="1"
        :max="3"
        :interval="0.1"
        :process-style="{ backgroundColor: '#0284c7' }"
        :tooltip-style="{ backgroundColor: '#0284c7', borderColor: '#0284c7' }"
        @change="handleSliderChange"
      >
        <template #dot>
          <div class="size-full rounded-lg bg-sky-600"></div>
        </template>
      </vue-slider>
    </div>
  </div>
</template>

<style scoped>
.img-wrappger {
  max-width: intrinsic; /* Safari/WebKit uses a non-standard name */
  max-width: -moz-max-content; /* Firefox/Gecko */
  max-width: -webkit-max-content; /* Chrome */
  max-height: intrinsic; /* Safari/WebKit uses a non-standard name */
  max-height: -moz-max-content; /* Firefox/Gecko */
  max-height: -webkit-max-content; /* Chrome */
}
</style>
