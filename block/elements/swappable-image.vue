<script lang="ts">
import { computed, defineComponent, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import tippy from 'tippy.js'

import { isAnimated } from '../utils/file'
import { useElement } from './base-element'
import { usePath } from './use-path'

export default defineComponent({
  props: {
    kind: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
    },
    defaultValue: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const blockId = inject<string>('blockId')
    const root = ref<HTMLElement>()
    const file = ref<HTMLInputElement>()
    const { path } = usePath(computed(() => [`b-${blockId}`, props.kind]))
    const element = useElement()

    element.value.setElementImage({
      path: path.value,
      data: props.defaultValue,
      noOverride: true,
      skipHistory: true,
    })

    onMounted(() => {
      const instance = tippy(root.value as HTMLElement, {
        content: 'Upload Logo',
        arrow: false,
      })

      onBeforeUnmount(() => {
        instance.destroy()
      })
    })

    return {
      root,
      file,
      src: computed(() => {
        // FIXME: fix type
        // @ts-expect-error fixme
        const value = path.value.reduce((obj, key) => obj?.[key], element.value.images)

        return value ?? ''
      }),
      upload() {
        const $file = file.value as HTMLInputElement
        $file.click()
      },
      async handleSwap(event: InputEvent) {
        const el = event.target as HTMLInputElement
        const file = el.files?.[0]
        if (file && !(await isAnimated(file))) {
          const url = await element.value.uploadImage(file)
          element.value.setElementImage({
            path: path.value,
            data: url,
          })
        }
      },
    }
  },
})
</script>

<template>
  <div ref="root" class="hover:shadow-active group relative cursor-pointer" @click.stop.prevent="upload">
    <img class="h-full" :src="src" :alt="alt" />
  </div>
</template>
