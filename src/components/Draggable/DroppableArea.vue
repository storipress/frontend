<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, inject, ref } from 'vue'
import type { DraggableComponentInfo, Point } from './definition'
import { key } from './definition'
import DraggableEntity from './DraggableEntity'
import { include } from './util'

export default defineComponent({
  props: {
    groupName: {
      type: String,
      default: '',
    },
    blockGroup: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: {
    dragMove: (_: HTMLElement) => true,
    dropped: () => true,
    dragOut: () => true,
  },
  setup(props, { emit }) {
    const draggableGroup = inject(key, reactive(new DraggableEntity()))
    const thisEl = ref<HTMLElement>()
    const draggingInfo = reactive<{
      index?: number
      srcElement?: HTMLElement
      location?: [number, number]
      draggingItemTemplate?: string
      draggingItemContainer?: HTMLElement
    }>({})
    const isDragIn = ref<boolean>()
    const hoverIndex = ref<string>()

    function reset() {
      draggingInfo.index = undefined
      draggingInfo.srcElement = undefined
      draggingInfo.location = undefined
      draggingInfo.draggingItemTemplate = undefined
      isDragIn.value = false
    }

    const draggableComponentInfo = computed(() => {
      return {
        $el: thisEl.value,
        groupName: props.groupName,
        blockGroup: props.blockGroup,
        draggingInfo,
        dragIn() {
          isDragIn.value = true
        },
        dragOut() {
          isDragIn.value = false
          emit('dragOut')
        },
        dragMove(point: Point) {
          const hoverEL = Array.from(thisEl.value?.querySelectorAll('.dropzone-item') ?? [])
            .filter((item) => item.id !== undefined)
            .reverse()
            .find((el) => include(el as HTMLElement, point))

          if (hoverEL) {
            hoverIndex.value = hoverEL.id
            emit('dragMove', hoverEL as HTMLElement)
          }
        },
        dropped() {
          emit('dropped')
        },
        getHoverIndex() {
          return hoverIndex.value
        },
        setHoverIndex(index: string) {
          hoverIndex.value = index
        },
        clearHoverIndex() {
          hoverIndex.value = undefined
        },
        reset,
      } as DraggableComponentInfo
    })
    watch(
      () => draggableGroup,
      (newVal, oldVal) => {
        if (oldVal) oldVal.removeGroup(props.groupName)
        if (newVal) oldVal.addGroup(props.groupName, draggableComponentInfo.value)
      },
    )
    watch(
      () => props.groupName,
      (newVal, oldVal) => {
        draggableGroup?.removeGroup(oldVal)
        if (draggableGroup) draggableGroup.addGroup(newVal, draggableComponentInfo.value)
      },
    )
    onMounted(() => {
      if (draggableGroup) draggableGroup.addGroup(props.groupName, draggableComponentInfo.value)
      if (thisEl.value) (thisEl.value as any).draggableListInstance = thisEl.value
    })
    onUnmounted(() => {
      if (draggableGroup) draggableGroup.removeGroup(props.groupName)
    })

    return {
      draggableGroup,
      thisEl,
      draggingInfo,
      draggableComponentInfo,
    }
  },
})
</script>

<template>
  <div :id="groupName" ref="thisEl" class="draggable-list overflow-y-auto overflow-x-hidden">
    <slot></slot>
  </div>
</template>

<style scoped></style>
