<script lang="ts" setup>
import { toRef, watch } from 'vue'
import { useArticleElement } from './inject'
import { useHeadlineWrapper } from './definition'
import { useOptimisticImage, useTippy, useUnsplashPicker } from '~/composables'
import { HeroContextMenu } from '~/components/Manager/HeroContextMenu'
import { ImageUploading } from '~/components/Shared'

defineProps<{ height?: string; width?: string }>()
const element = useArticleElement()
const headline = toRef(element, 'headlineURL')
const headlineAlt = toRef(element, 'headlineAlt')
const focus = toRef(element, 'headlineFocus')

const { url, upload, loading } = useOptimisticImage({
  url: headline,
  async upload(file) {
    const image = await element.uploadImage(file)
    headline.value = element.createImageURL(image.url)
  },
})

const { reference, popup, instance } = useTippy({
  options: {
    arrow: false,
    placement: 'bottom',
    interactive: true,
    trigger: 'focusin mouseenter',
  },
})
const wrapper = useHeadlineWrapper()
const { open } = useUnsplashPicker()

watch([wrapper, instance], ([wrapper, instance]) => {
  if (wrapper) {
    instance?.setProps({ triggerTarget: wrapper })
  }
})

async function handleUnsplash() {
  const res = await open()
  if (!res) {
    return
  }
  element.headlineURL = res.src
  element.headlineAlt = res.alt
  element.headlineCaption = res.title
}
</script>

<template>
  <div ref="reference" class="headline">
    <div class="relative h-full overflow-hidden" :style="{ height: `${height}px`, width: `${width}px` }">
      <!-- w-auto h-auto is used to prevent aspect ratio plugin affect -->
      <img
        class="absolute inset-0 size-full object-cover"
        :class="loading && 'blur-sm'"
        :src="url"
        :alt="headlineAlt"
        :value="focus"
      />
      <ImageUploading v-if="loading" />
    </div>
    <HeroContextMenu
      v-if="element.editable"
      ref="popup"
      :uploaded="!!element.headlineURL"
      @remove="element.headlineURL = ''"
      @upload="upload"
      @unsplash="handleUnsplash"
    />
  </div>
</template>
