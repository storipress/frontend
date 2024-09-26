<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { nanoid } from 'nanoid'
import { render } from 'eta'

import type { TemplateFunction } from 'eta/dist/types/compile'
import previewTemplate from './preview-iframe.html.eta'

export default defineComponent({
  props: {
    html: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const root = ref<HTMLElement>()
    const id = nanoid()
    const preview = computed(
      () => render(previewTemplate as unknown as TemplateFunction, { html: props.html, id }) as string,
    )
    const style = reactive({
      width: '100%',
      height: '300px',
    })

    onMounted(() => {
      const $root = root.value as any
      $root._iframeResize = (rect: DOMRect) => {
        style.height = `${rect.height}px`
      }
    })

    return {
      root,
      id: `preview-${id}`,
      preview,
      style,
    }
  },
})
</script>

<template>
  <div :id="id" ref="root" :style="style">
    <iframe
      :srcdoc="preview"
      class="dark:bg-white"
      width="100%"
      height="100%"
      sandbox="
          allow-forms
          allow-popups
          allow-popups-to-escape-sandbox
          allow-same-origin
          allow-scripts
        "
    />
  </div>
</template>
