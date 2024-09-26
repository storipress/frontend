<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchPreview',
  components: {},
  props: {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
  },
  setup() {},
})
</script>

<template>
  <div
    class="layer-2 absolute z-[1] w-[calc(100vw-4rem)] overflow-hidden whitespace-normal break-words rounded-sm border border-gray-100 bg-white p-4 md:w-[43rem]"
  >
    <p class="mb-1 block w-full text-xl text-[#1a0dab]">{{ title }}</p>
    <div class="mb-2 line-clamp-1 text-sm text-[#006621]">
      <span>{{ slug }}</span>
    </div>
    <p class="line-clamp-2 text-sm text-stone-600/50">{{ description }}</p>
  </div>
</template>
