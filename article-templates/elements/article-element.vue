<script lang="ts">
import type { PropType, Ref } from 'vue'
import { computed, defineComponent, onMounted, toRef, watch } from 'vue'

import { convertNameToPath } from './utils'
import { useArticleElement } from './inject'
import type { PseudoElement } from './use-pseudo-element'
import { usePseudoElement } from './use-pseudo-element'

export default defineComponent({
  props: {
    component: {
      type: String,
      required: true,
    },
    path: {
      type: Array as PropType<string[]>,
    },
    kind: {
      type: String,
      required: true,
    },
    display: {
      type: String,
    },
    styles: {
      type: Object,
      default: () => Object.freeze({}),
    },
    pseudoElements: {
      type: Array as () => PseudoElement[],
      default: () => [],
    },
  },

  setup(props) {
    const element = useArticleElement()

    const { listeners, pseudo, rect, root, refreshRect, hasPseudoElement, findPseudoElement } = usePseudoElement({
      props,
      editable: toRef(element, 'editable'),
      setHover,
      updateStore,
    })

    function createStateGetter(state: 'hover' | 'selected', kind: Ref<string | null>) {
      return () => {
        return kind.value && element.selectable && element.section[state]?.name === kind.value
      }
    }

    const kind = toRef(props, 'kind')

    const isPseudoHover = computed(createStateGetter('hover', pseudo))
    const isPseudoSelected = computed(createStateGetter('selected', pseudo))
    const isHover = computed(createStateGetter('hover', kind))
    const isSelected = computed(createStateGetter('selected', kind))
    const computedPath = computed(() => {
      if (pseudo.value && (isPseudoHover.value || isPseudoSelected.value)) {
        return convertNameToPath(pseudo.value)
      }

      if (props.path) {
        return props.path
      }

      return convertNameToPath(props.kind)
    })

    function setHover(event?: MouseEvent) {
      if (event) {
        const name = findPseudoElement(event)
        if (name) {
          return
        }
      }
      updateStore('hover', props.kind)
    }
    function updateSelected(event: MouseEvent) {
      const pseudo = findPseudoElement(event)
      if (pseudo) {
        return updateStore('selected', pseudo)
      }
      updateStore('selected', props.kind)
    }
    function clearHover() {
      updateStore('hover', null)
    }

    function updateStore(kind: 'selected' | 'hover', name: string | null) {
      if (!element.selectable) {
        return
      }

      const current = element.section[kind]?.name
      if (current === name) {
        return
      }
      const commit = kind === 'selected' ? element.setSectionSelect : element.setSectionHover
      commit(name ? { name, path: computedPath.value, display: props.display } : null)
    }

    onMounted(() => {
      element.registerElementDefault(props.path ?? convertNameToPath(props.kind), props.styles)

      watch(() => element.elements, refreshRect, { deep: true, flush: 'post' })
    })

    return {
      root,
      pseudo,
      rect,
      isPseudoHover,
      isPseudoSelected,
      isHover,
      isSelected,
      boxStyle: computed(() => {
        const r = rect.value
        return r
          ? { left: `${r.left}px`, top: `${r.top}px`, width: `${r.right - r.left}px`, height: `${r.bottom - r.top}px` }
          : undefined
      }),
      hasPseudoElement,
      variants: computed(() => element.elements),
      listeners,

      setHover,
      clearHover,
      updateSelected,
    }
  },
})
</script>

<template>
  <component
    :is="component"
    ref="root"
    class="relative"
    :class="[isHover && 'shadow-hover', isSelected && 'shadow-active']"
    @click.stop="updateSelected"
    @mouseover="setHover"
    @mouseout="clearHover"
    v-on="listeners"
  >
    <slot />
    <div
      v-if="hasPseudoElement && rect"
      class="absolute"
      :class="[isPseudoHover && 'shadow-hover', isPseudoSelected && 'shadow-active']"
      :style="boxStyle"
    />
  </component>
</template>
