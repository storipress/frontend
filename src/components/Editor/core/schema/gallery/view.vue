<script lang="ts">
import { Icon } from '@storipress/core-component'
import { defineComponent, nextTick } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import pMap from 'p-map'
import { produce } from 'immer'
import ImageItem from './image-item.vue'
import { getAPI } from '~/components/Editor/core/api'
import { allowedImageType, isInvalidImage } from '~/utils/file'
import { useTogglePopup } from '~/composables'
import type { UploadReturnInfo } from '~/components/Editor/core/api'
import OpenTransition from '~/components/Transitions/open-transition.vue'

interface TImage {
  url: string
  nowIndex: number
}

export default defineComponent({
  name: 'GalleryView',
  components: { Icon, NodeViewWrapper, ImageItem, OpenTransition },
  props: {
    ...nodeViewProps,
  },
  setup() {
    const { open, reference, togglePopup, popup } = useTogglePopup({
      options: {
        placement: 'top',
      },
    })

    return {
      open,
      reference,
      togglePopup,
      popup,
      allowedImageType,
    }
  },
  data: () => ({
    pending: [] as string[],
    uploaded: [] as boolean[],
    pendingRatio: [] as number[],
    allUploaded: true,
  }),
  computed: {
    id(): string {
      return this.node?.attrs.id
    },
    uploadEmpty(): boolean {
      return this.pending.length === 0
    },
    uploadRows(): TImage[][] {
      function buildStructure(images: string[]) {
        const rows: TImage[][] = []
        const noOfImages = images.length
        let nowRow = 0
        let nowIndex = 0

        images.forEach((url, idx) => {
          if (noOfImages > 1) {
            if (noOfImages === 4) {
              if (idx === 2) nowRow += 1
            }
            if (noOfImages === 5 || noOfImages === 6) {
              if (idx === 3) nowRow += 1
            }
            if (noOfImages === 7) {
              if (idx === 3 || idx === 5) nowRow += 1
            }
            if (noOfImages === 8 || noOfImages === 9) {
              if (idx === 3 || idx === 6) nowRow += 1
            }
          }

          if (!rows[nowRow]) {
            rows[nowRow] = []
          }
          rows[nowRow].push({ url, nowIndex: nowIndex++ })
        })
        return rows
      }
      const mergedImages: string[] = []
      this.pending.forEach((url, index) => (mergedImages[index] = url))
      return buildStructure(mergedImages)
    },
    images: {
      get(): string[] {
        return this.node?.attrs.images
      },
      set(val: string[]) {
        try {
          this.updateAttributes?.({ images: val })
        } catch (e) {
          // Ignore error
        }
      },
    },
    ratio: {
      get(): number[] {
        return this.node?.attrs.ratio
      },
      set(val: number[]) {
        try {
          this.updateAttributes?.({ ratio: val })
        } catch (e) {
          // Ignore error
        }
      },
    },
  },
  watch: {
    async selected(val) {
      if (val) {
        await nextTick()

        const $input = this.$refs.input as HTMLElement | undefined
        if ($input) {
          $input.focus()
        }
      }
    },
    async images(newImages: string[]) {
      this.addAllImageStyle(newImages)
    },
  },
  mounted() {
    this.addAllImageStyle(this.images)
  },
  methods: {
    handleRemove(targetIndex: number) {
      if (targetIndex >= 0) {
        this.images = this.images.filter((_, index) => index !== targetIndex)
        this.ratio = this.ratio.filter((_, index) => index !== targetIndex)
      }
    },
    deleteCard() {
      this.deleteNode?.()
    },
    setSelection() {
      this.editor?.commands.setNodeSelection(this.getPos?.() as number)
    },
    addImageStyle(src: string, index: number) {
      const img = new Image()
      img.onload = () => {
        const ratio = img.width / img.height
        this.ratio = produce(this.ratio, (newRatio) => {
          newRatio[index] = ratio
        })
      }
      img.src = src
    },
    addAllImageStyle(images: string[]) {
      this.pending = []
      images.forEach((src, index) => {
        this.pending[index] = src
        this.addImageStyle(src, index)
      })
    },
    async onUpload(event: Event) {
      const target = event?.target as HTMLInputElement
      if (!target || !target.files) return
      // upper bound is 9 pictures

      const imgs = [...(target.files as FileList)].slice(0, 9 - this.images.length)
      // reset file input so user can retry failed upload
      target.value = ''
      const api = getAPI()
      this.allUploaded = false
      const results = await pMap(imgs, async (file) => {
        if (await isInvalidImage(file)) return ''
        const url = URL.createObjectURL(file)
        const nowIndex = this.pending.length > this.images.length ? this.pending.length : this.images.length
        this.pending[nowIndex] = url
        this.addImageStyle(url, nowIndex)
        this.uploaded[nowIndex] = false
        const res = await api.uploadImage(file)
        this.uploaded[nowIndex] = true
        return res
      })
      this.images = this.images.concat(
        results.filter((res): res is UploadReturnInfo => res !== '').map((info) => info.url),
      )
      this.allUploaded = true
    },
  },
})
</script>

<template>
  <NodeViewWrapper
    class="interactive-node"
    data-format="gallery"
    :class="[selected && 'has-focus']"
    :data-sapling-ignore="true"
    :data-id="id"
    @mouseleave="open = false"
  >
    <div v-if="!uploadEmpty && allUploaded" ref="popup">
      <OpenTransition>
        <div v-if="open" class="layer-2 z-10 mb-1 flex space-x-5 rounded-lg border bg-white px-2.5 py-2">
          <div role="button" class="relative items-center justify-center" @click="deleteCard">
            <Icon
              class="text-[.75rem] text-stone-600 transition-opacity duration-150 hover:opacity-50"
              icon-name="delete"
            />
          </div>
          <label role="button" class="relative items-center justify-center" for="upload-gallery-image">
            <Icon
              class="text-[.75rem] text-stone-600 transition-opacity duration-150 hover:opacity-50"
              icon-name="plus"
            />
            <input
              id="upload-gallery-image"
              type="file"
              class="hidden"
              multiple
              :accept="allowedImageType"
              @change="
                (e) => {
                  togglePopup()
                  onUpload(e)
                }
              "
            />
          </label>
        </div>
      </OpenTransition>
    </div>
    <div v-if="!uploadEmpty" ref="reference" class="gallery-card" @click="setSelection" @mouseover="open = true">
      <div v-for="(row, rowIndex) in uploadRows" :key="`row${rowIndex}`" class="gallery-row space-x-2">
        <ImageItem
          v-for="{ url, nowIndex } in row"
          :key="url"
          :style="{ flex: `${ratio[nowIndex]} 1 0%` }"
          :src="url"
          :uploading="uploaded[nowIndex] === false"
          :all-uploaded="allUploaded"
          @remove="
            () => {
              togglePopup()
              handleRemove(nowIndex)
            }
          "
        />
      </div>
    </div>
    <label
      v-else
      for="uploadGalleryImage"
      class="flex h-80 w-full cursor-pointer items-center justify-center border border-stone-200 bg-stone-50"
    >
      <div class="flex flex-col items-center space-y-2">
        <Icon class="text-[2rem] text-stone-600" icon-name="add_image" />
        <div class="text-caption flex flex-col items-center text-stone-400">
          <div>Upload up</div>
          <div>to 9 images</div>
        </div>
        <input
          id="uploadGalleryImage"
          type="file"
          class="hidden"
          multiple
          :accept="allowedImageType"
          @change="onUpload"
        />
      </div>
    </label>
  </NodeViewWrapper>
</template>
