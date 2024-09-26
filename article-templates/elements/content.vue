<script lang="ts">
import { debounce } from 'lodash'
import { onClickOutside, unrefElement, useResizeObserver } from '@vueuse/core'
import type { ComponentPublicInstance, Ref } from 'vue'
import { computed, defineComponent, provide, ref, toRef } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleElement } from './inject'
import { EditorContainer } from '~/components/Editor/EditorContainer'

// import { findDropcap } from './drop-cap'

export default defineComponent({
  components: {
    EditorContainer,
  },
  setup() {
    const root = ref<HTMLElement>()
    const content = ref<HTMLElement | ComponentPublicInstance>()
    const left = ref(0)
    const width = ref(0)
    const route = useRoute()

    provide('registerContentElement', (kind: string, $el: Element) => {
      // if (kind === 'p' && root.value?.querySelector('p') === $el) {
      //   return [findDropcap]
      // }
      return []
    })

    const element = useArticleElement()

    useResizeObserver(
      root,
      debounce(() => {
        if (root.value instanceof HTMLElement) {
          const rect = root.value.getBoundingClientRect()
          const body = document.querySelector('body')
          left.value = rect.left

          if (body instanceof HTMLElement) {
            const bodyRect = body.getBoundingClientRect()
            width.value = bodyRect.width
          }

          if (content.value) {
            const unrefContent = unrefElement(content)
            if (unrefContent instanceof HTMLElement) {
              const rect = unrefContent.getBoundingClientRect()
              left.value = rect.left
            }
          }
        }
      }, 10),
    )

    onClickOutside(content, (event) => {
      if (!event) {
        element.setSectionSelect(null)
        return
      }

      if (!element.selectable || !event.target) {
        return
      }

      element.setSectionSelect(null)
    })

    return {
      root,
      left,
      width,
      content,
      id: toRef(route.params, 'id') as Ref<string>,
      client: toRef(route.params, 'clientID') as Ref<string>,
      preview: toRef(element, 'preview'),
      editable: toRef(element, 'editable'),
      html: toRef(element, 'content'),
      elementStyles: computed((): string[] => {
        return Object.entries(element.elements || {}).map(([key, value]) => `${key}--${value}`)
      }),
    }
  },
})
</script>

<template>
  <div
    ref="root"
    class="article-content"
    :class="elementStyles"
    :style="`--left-offset: ${left}px;--body-width: ${width}px`"
  >
    <EditorContainer v-if="editable" :id="id" ref="content" class="w-full" :client="client" :comment="false" />
    <div v-else-if="preview" ref="content" class="main-content" v-html="html" />
    <div v-else ref="content" class="main-content">
      <slot />
    </div>
    <div v-if="editable || preview" class="hidden">
      <slot />
    </div>
  </div>
</template>
