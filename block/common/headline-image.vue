<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'

import ResponsiveImage from './responsive-image.vue'

interface Focus {
  x: number
  y: number
}

interface ArticleImage {
  headline: string
  headlineAlt: string
  headlineFocus: Focus
}

export default defineComponent({
  components: { ResponsiveImage },

  props: {
    article: {
      type: Object as PropType<ArticleImage>,
      required: true,
    },
    sizes: {
      type: String,
    },
  },

  setup(props) {
    const src = computed(() => props.article.headline)
    const alt = computed(() => props.article.headlineAlt)
    // const focus = computed(() => props.article.headlineFocus)
    // const { image } = useFocusedImage<Vue>({
    //   extractor: (x: Vue) => x.$el as HTMLImageElement,
    //   src,
    //   focus,
    // })

    return {
      // image,
      src,
      alt,
    }
  },
})
</script>

<template>
  <div class="relative">
    <!-- w-auto h-auto is used to prevent aspect ratio plugin affect -->
    <ResponsiveImage
      ref="image"
      class="transition-position inset-0 size-auto min-h-full min-w-full max-w-none object-cover"
      :src="src"
      :sizes="sizes"
      :alt="alt"
    />
  </div>
</template>
