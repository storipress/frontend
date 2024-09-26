<script lang="ts">
import { defineComponent } from 'vue'
import { ResponsiveImage } from '../../common'

export default defineComponent({
  name: 'SearchBlock',
  components: { ResponsiveImage },
  props: {
    log: {
      type: Object,
      default: () => ({}),
    },
    url: {
      type: String,
      default: '',
    },
    info: {
      type: String,
      default: '',
    },
  },
  methods: {
    filterHTMLTag(text: string) {
      return text
        .replace(/<\/?[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .trim()
    },
  },
})
</script>

<template>
  <div class="block-wrapper mb-8 block md:mb-auto lg:mb-auto">
    <div class="aspect-h-9 aspect-w-16 relative overflow-hidden opacity-100">
      <ResponsiveImage class="absolute size-full object-cover" :src="url" :alt="info" />
    </div>
    <div class="long-title overflow-x-hidden leading-snug md:leading-7 lg:leading-7">
      {{ filterHTMLTag(log.title) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.block-wrapper:hover {
  opacity: 0.85;
  background: black;
  transition: all 0.35s ease-in-out;
}

img {
  @apply block h-full w-full cursor-pointer;

  transition: all 0.4s ease-in-out;
  transition-delay: 40ms;
  transform: scale(1);

  &:hover {
    transform: scale(1.08);
  }
}

.long-title {
  @apply mx-auto my-4 h-16 w-4/5 text-center text-2xl font-light text-white;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-y: hidden;

  @screen lg {
    height: 4.5rem;
  }
}
</style>
