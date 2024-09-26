import type { Ref } from 'vue'
import { computed, nextTick, provide, ref, watch } from 'vue'

import { raf } from '../utils/timer'
import type { BlockInjected } from './base-element'
import { useElement } from './base-element'

export interface BlockProp {
  id: string
  order: number
}

export function useBlock(props: { block: BlockProp }) {
  const highlightAnimate = ref(false)
  const root = ref<HTMLElement>(document.createElement('div'))
  const $element = useElement()
  const active = computed((): boolean => {
    return $element.value.selectedBlock?.id === props.block.id && !$element.value.insertPoint
  })
  const highlight = computed((): boolean => {
    return props.block.id === $element.value.highlightedBlock?.id
  })

  const setSelected = (): void => {
    if ($element.value.insertPoint) {
      return
    }

    const $root = root.value

    $element.value.setSelectedBlock({
      id: props.block.id,
      order: props.block.order,
      top: $root.offsetTop,
      height: $root.offsetHeight,
    })
  }

  watch(
    () => props.block.order,
    async () => {
      if (!active.value) {
        return
      }

      await nextTick()

      // force update position after reorder
      setSelected()
    },
  )

  watch(
    highlight,
    async (val) => {
      // need to wait dom update here
      highlightAnimate.value = false
      if (val) {
        await nextTick()
        await raf()
      }
      highlightAnimate.value = val
    },
    { immediate: true },
  )

  provide('blockId', props.block.id)

  async function setInsert(bottom: boolean) {
    const order = props.block.order + (bottom ? 1 : 0)
    const $root = root.value
    $element.value.setInsert({
      at: order,
      offset: $root.offsetTop + (bottom ? $root.offsetHeight : 0),
    })
    await nextTick()
    // wait height locking
    await nextTick()
    // update offset again to make sure it is correct
    $element.value.setInsert({
      at: order,
      offset: $root.offsetTop + (bottom ? $root.offsetHeight : 0),
    })
  }

  return {
    root,

    blockClasses: computed((): Record<string, unknown> => {
      const { block } = props
      const { insertPoint } = $element.value

      return {
        [`b-${block.id} ring-clear-blue ring-inset`]: true,
        // TODO: consider use another element for this as it may cover by other elements
        'ring-2': active.value,
        highlight: highlight.value,
        // FIXME: this should not need the `highlight.value` check, but the watch somehow doesn't work
        'highlight-grow': highlightAnimate.value && highlight.value,
        'insert-mode': Boolean(insertPoint),
        'hover:ring-2': !insertPoint,
      }
    }),

    setSelected,
    handleClickOutside(event?: MouseEvent): void {
      if (!event) {
        $element.value.setSelectedBlock(null)
        return
      }
      if (!active.value) {
        return
      }
      $element.value.setSelectedBlock(null)
    },

    insertBefore() {
      setInsert(false)
    },

    insertAfter(): void {
      setInsert(true)
    },

    ...useHeightLocking($element, root, props.block.id),
  }
}

const oldStyles: Record<string, { type: string; styles: Record<string, unknown> }> = {}

// when using vh, we need to add a height to the block or it will be too height when inserting
function useHeightLocking(element: Ref<BlockInjected>, root: Ref<Vue | undefined>, id: string) {
  const styles = ref<Record<string, unknown>>({})
  let skip = false

  if (element.value.insertPoint) {
    styles.value =
      oldStyles[id]?.type === element.value.blockStates[id]?.type
        ? oldStyles[id]?.styles
        : {
            overflow: 'hidden',
            maxHeight: '1024px',
          }
  }

  async function computeHeight() {
    if (skip) {
      return
    }
    const $root = root.value
    const rect = {
      width: $root.offsetWidth,
      height: $root.offsetHeight,
    }
    await nextTick()
    const aspectRatio = rect.width / rect.height
    const height = $root.offsetWidth / aspectRatio
    styles.value = {
      overflow: 'hidden',
      height: `${height}px`,
      maxHeight: `${height}px`,
    }
    oldStyles[id] = {
      type: element.value.blockStates[id]?.type,
      styles: styles.value,
    }
  }

  watch(
    () => element.value.insertPoint,
    (insertPoint) => {
      if (insertPoint) {
        computeHeight()
        // only need to compute height once
        skip = true
      } else {
        styles.value = {}
        Reflect.deleteProperty(oldStyles, id)
        skip = false
      }
    },
  )

  return {
    styles,
  }
}
