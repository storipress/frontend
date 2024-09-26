<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useIntersectionObserver, whenever } from '@vueuse/core'
import { LoadingSpinner } from '@storipress/core-component'
import Unsplash from './unsplash-full.svg'
import type { Photo, UnsplashClient } from '~/utils/editor/clients/unsplash'

export default defineComponent({
  components: { LoadingSpinner },

  props: {
    client: {
      type: Object as PropType<UnsplashClient>,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['reply'],

  setup(props, { emit }) {
    const grid = ref<HTMLElement>()
    const sensor = ref<HTMLElement>()
    const photos = ref([] as Photo[])
    const search = ref('')
    let loading = true
    let loaded = 0
    let page = 1

    function reset() {
      loaded = 0
      page = 1
    }

    function fetchPage(page: number): Promise<Photo[]> {
      return search.value ? props.client.searchPhotos(search.value, page) : props.client.listPhotos(page)
    }

    whenever(
      () => props.open,
      async () => {
        reset()

        loading = true

        photos.value = await props.client.listPhotos(page)

        loading = false
      },
      { immediate: true },
    )

    watch(
      search,

      debounce(async () => {
        reset()

        loading = true
        if (search.value.trim()) {
          photos.value = await props.client.searchPhotos(search.value)
        } else {
          photos.value = await props.client.listPhotos(page)
        }
      }, 150),
    )

    useIntersectionObserver(sensor, async ([{ isIntersecting }]) => {
      if (loading || !isIntersecting) {
        return
      }

      page += 1

      const newPhotos = await fetchPage(page)

      photos.value = [...photos.value, ...newPhotos]
    })

    return {
      grid,
      photos,
      search,
      sensor,
      Unsplash,

      async submit(photo: Photo) {
        await props.client.downloadPhoto(photo.id)
        emit('reply', {
          src: photo.urls.regular,
          alt: photo.description,
          title: `<p>Photo by <a href="${photo.user.links.html}?utm_source=storipress&utm_medium=referral&utm_campaign=api-credit">${photo.user.name}</a> / <a href="https://unsplash.com/?utm_source=storipress&utm_medium=referral&utm_campaign=api-credit">Unsplash</a></p>`,
        })
      },
      countLoad() {
        loaded += 1

        if (loaded === photos.value.length) {
          loading = false
        }
      },
    }
  },
})
</script>

<template>
  <div
    class="relative h-[80vh] w-[95vw] max-w-[66rem] overflow-hidden overflow-y-auto rounded-lg bg-white shadow-3-layer scrollbar-hide md:h-[80vh] md:w-[70vw]"
  >
    <!-- header parent -->
    <div class="sticky top-0 z-[41] flex bg-white/5 py-3 pl-3 pr-2 backdrop-blur-xl">
      <!-- logo -->
      <img :src="Unsplash" class="ml-2 mr-4 h-6 self-center md:mr-5" />

      <!-- search input -->
      <label class="flex h-9 grow rounded border border-gray-200 bg-stone-50/80 pl-2.5 align-middle backdrop-blur-3xl">
        <input
          v-model="search"
          class="text-inputs w-full bg-transparent outline-none"
          placeholder="Search for an image..."
        />
      </label>
    </div>

    <!-- masonry parent -->
    <div
      ref="grid"
      v-masonry
      item-selector=".photo"
      transition-duration="0"
      gutter="8"
      class="mx-2 overflow-hidden rounded-t-md"
    >
      <!-- individual masonary photo -->
      <figure
        v-for="photo in photos"
        :key="photo.id"
        v-masonry-tile
        class="photo group mb-2 h-min w-[calc((100%-1rem)/3)] cursor-pointer overflow-hidden rounded-md transition"
        @click="submit(photo)"
      >
        <img
          class="w-full transition duration-300 group-hover:opacity-75"
          :src="photo.urls.small"
          :alt="photo.description"
          @load="countLoad"
        />
        <!-- hover menu -->
        <figcaption
          class="invisible absolute bottom-0 flex w-full items-center bg-black bg-opacity-50 p-2 opacity-0 transition delay-100 duration-300 group-hover:visible group-hover:opacity-100"
        >
          <!-- attribution avatar -->
          <span class="mr-2 overflow-hidden rounded-full">
            <img class="rounded" :src="photo.user.profile_image.small" :alt="photo.user.name" />
          </span>
          <!-- attribution name -->
          <span class="text-body grow text-white">{{ photo.user.name }}</span>
        </figcaption>
      </figure>
    </div>

    <div ref="sensor" class="flex w-full justify-center">
      <LoadingSpinner show />
    </div>
  </div>
</template>
