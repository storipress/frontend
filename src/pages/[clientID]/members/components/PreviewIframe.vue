<script lang="ts" setup>
import { useResizeObserver } from '@vueuse/core'
import { debounce } from 'lodash'
import favicon from '@assets/logomark-l.svg'
import { usePolyfill } from '~/components/Manager/StylePicker/polyfill'

interface TProps {
  url: string
}
const props = withDefaults(defineProps<TProps>(), {
  url: '',
})

const previewRef = ref<HTMLElement>()
const elementWidth = 1200
const elementHeight = ref(2000)

useResizeObserver(
  previewRef,
  debounce(([ResizeObserverEntry]) => {
    const proportion = elementWidth / ResizeObserverEntry.contentRect.width
    elementHeight.value = ResizeObserverEntry.contentRect.height * proportion
  }, 100),
)

usePolyfill()
</script>

<template>
  <div class="flex h-full flex-col self-center shadow-3-layer">
    <div class="flex h-10 w-full rounded-t-lg bg-[#f3f3f3]">
      <div class="ml-3 mr-4 flex items-center gap-2">
        <i v-for="i in 3" :key="i" class="mb-1 size-[0.625rem] rounded-full bg-stone-200" />
      </div>
      <div
        class="mt-[0.438rem] flex w-52 items-center gap-1 rounded-t border border-b-0 border-gray-200 p-2 shadow-1-layer"
      >
        <img :src="favicon" alt="Storipress icon" class="size-4" />
        <p class="text-xs text-stone-900">Publication Name</p>
      </div>
    </div>
    <div ref="previewRef" class="relative max-h-full flex-1 overflow-hidden">
      <svg
        class="absolute"
        :viewBox="`0 0 ${elementWidth} ${elementHeight}`"
        xmlns="http://www.w3.org/2000/svg"
        data-marpit-svg=""
      >
        <foreignObject :width="elementWidth" :height="elementHeight">
          <section xmlns="http://www.w3.org/1999/xhtml" class="relative h-full">
            <iframe
              v-if="props.url"
              :src="props.url"
              frameborder="0"
              :width="elementWidth"
              :height="elementHeight"
            ></iframe>
            <div class="absolute inset-y-0 right-0 z-10 flex md:w-[28.125rem]">
              <slot />
              <div class="absolute inset-0" />
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-[3px]" />
          </section>
        </foreignObject>
      </svg>
    </div>
  </div>
</template>
