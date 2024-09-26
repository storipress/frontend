<!-- eslint-disable tailwindcss/no-custom-classname -->
<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, inject, ref, toRaw } from 'vue'
import { Portal } from '@headlessui/vue'
import type { DraggableComponentInfo, Point } from './definition'
import { key } from './definition'
import { closest, getElementCenter, hierarchicalScroll, include } from './util'
import DraggableEntity from './DraggableEntity'

export default defineComponent({
  name: 'DraggableList',
  components: { Portal },
  props: {
    groupName: {
      type: String,
      default: '',
    },
    blockGroup: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    list: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => [],
    },
    getItemKey: {
      type: Function as PropType<(item: any, index: number) => string>,
      default: () => (item: any, index: number) => `${item.id ?? index}`,
    },
    disabled: {
      type: Object as PropType<{ sorting: boolean; group: boolean; itemKeyList: string[] }>,
      default: () => ({ sorting: false, group: false, itemKeyList: [] }),
    },
    pressDelay: {
      type: Number,
      default: 0,
    },
    droppingTime: {
      type: Number,
      default: 100,
    },
  },
  emits: {
    startDragging: (_: { index: number; group: string }) => true,
    endDragging: () => true,
    dropToChange: (_: {
      oldValue: { index: number | string; group: string }
      newValue: { index: number | string; group: string }
    }) => true,
  },
  setup(props, { emit }) {
    const draggableGroup = inject(key, reactive(new DraggableEntity()))
    const thisEl = ref<HTMLElement>()
    const scrolling = ref<boolean>(false)
    const draggingInfo = reactive<{
      index?: number
      srcElement?: HTMLElement
      location?: [number, number]
      draggingItemTemplate?: string
      draggingItemContainer?: HTMLElement
    }>({})
    const hoverIndex = ref<number>()
    const isDragIn = ref<boolean>()
    let lastMouseEvent: Point | undefined
    let pressDelayTimeId: NodeJS.Timeout | undefined
    let afterScrollTimeId: NodeJS.Timeout | undefined
    const isDropping = ref<boolean>(false)

    const currentChange = computed(() => {
      return {
        oldValue: {
          index: draggableGroup.srcGroup?.draggingInfo.index,
          group: draggableGroup.srcGroup?.groupName,
        },
        newValue: {
          index: draggableGroup.destGroup?.getHoverIndex(),
          group: draggableGroup.destGroup?.groupName,
        },
      }
    })

    function handleDragging($event: Point) {
      // move dragging item
      const srcDraggingInfo = draggableGroup.srcGroup?.draggingInfo
      const draggingEl = srcDraggingInfo?.draggingItemContainer
      if (lastMouseEvent == null) return
      if (srcDraggingInfo?.location == null) return
      if (draggingEl == null) return
      srcDraggingInfo.location[0] = $event.x - draggingEl.clientWidth / 2
      srcDraggingInfo.location[1] = $event.y - draggingEl.clientHeight / 2
      lastMouseEvent = $event

      // get focused draggable component's element
      const focusedDraggableEl = draggableGroup
        .getAllListRootElement()
        .find((list) => include(list, lastMouseEvent as Point))
      const container = closest(focusedDraggableEl ?? (thisEl.value as HTMLElement), (el) =>
        include(el, lastMouseEvent as Point),
      )
      if (!container) return

      if (focusedDraggableEl) {
        const newDestGroup = draggableGroup.findGroupByContainerEl(focusedDraggableEl)
        if (draggableGroup.destGroup?.groupName !== newDestGroup?.groupName) {
          draggableGroup.hoverOut()
          draggableGroup.hoverIn(newDestGroup?.groupName as string)
        }
      } else if (draggableGroup.destGroup) {
        draggableGroup.hoverOut()
      }

      if (afterScrollTimeId) clearTimeout(afterScrollTimeId)
      if (hierarchicalScroll(container, lastMouseEvent as Point)) {
        afterScrollTimeId = setTimeout(() => handleDragging(lastMouseEvent as Point), 5)
      } else if (focusedDraggableEl) {
        if (props.disabled.sorting && focusedDraggableEl === draggableGroup.srcGroup?.$el) return
        if (props.disabled.group && focusedDraggableEl !== draggableGroup.srcGroup?.$el) return
        if (props.blockGroup?.includes(focusedDraggableEl.id)) return

        draggableGroup.destGroup?.dragMove({
          x: srcDraggingInfo.location[0] + (srcDraggingInfo.draggingItemContainer?.clientWidth ?? 0) / 2,
          y: srcDraggingInfo.location[1] + (srcDraggingInfo.draggingItemContainer?.clientHeight ?? 0) / 2,
        })
      }
    }

    function handleDropped($event: MouseEvent) {
      emit('endDragging')
      document.body.removeEventListener('mousemove', handleDragging)
      document.body.removeEventListener('mouseup', handleDropped)
      const srcDraggingInfo = draggableGroup.srcGroup?.draggingInfo
      if (!srcDraggingInfo) return
      const targetEl = (Array.from(draggableGroup.destGroup?.$el?.querySelectorAll('.dropzone-item') ?? [])
        .filter((item) => item.id !== undefined)
        .reverse()
        .find((el) => include(el as HTMLElement, $event)) || srcDraggingInfo.srcElement) as HTMLElement
      if (!targetEl) return

      const draggingEl = srcDraggingInfo.draggingItemContainer as HTMLElement
      isDropping.value = true
      draggingEl?.classList.add('transition-all', 'ease-in')
      draggingEl.style.transitionDuration = `${props.droppingTime}ms`
      const moveTo = targetEl.getBoundingClientRect()
      if (moveTo.x >= 0 && moveTo.y >= 0) {
        srcDraggingInfo.location = [moveTo.x, moveTo.y]
      } else {
        srcDraggingInfo.location = [Math.max(moveTo.x, 0), Math.max(moveTo.y, 0)]
        draggingEl.style.opacity = '0'
      }
      setTimeout(() => {
        draggingEl?.classList.remove('transition-all', 'ease-in')
        draggingEl.style.transitionDuration = ''
        draggingEl.style.opacity = ''
        if (
          currentChange.value.oldValue.index !== undefined &&
          currentChange.value.oldValue.group !== undefined &&
          currentChange.value.newValue.index !== undefined &&
          currentChange.value.newValue.group !== undefined
        ) {
          emit('dropToChange', {
            oldValue: {
              index: currentChange.value.oldValue.index,
              group: currentChange.value.oldValue.group,
            },
            newValue: {
              index: currentChange.value.newValue.index,
              group: currentChange.value.newValue.group,
            },
          })
        }
        draggableGroup.srcGroup?.reset()
        draggableGroup.destGroup?.reset()
        draggableGroup.endDropped()
        document.body.classList.remove('select-none')
      }, props.droppingTime)
    }

    function reset() {
      scrolling.value = false
      draggingInfo.index = undefined
      draggingInfo.srcElement = undefined
      draggingInfo.location = undefined
      draggingInfo.draggingItemTemplate = undefined
      hoverIndex.value = undefined
      isDragIn.value = false
      lastMouseEvent = undefined
      if (pressDelayTimeId) {
        clearTimeout(pressDelayTimeId)
        pressDelayTimeId = undefined
      }
      if (afterScrollTimeId) {
        clearTimeout(afterScrollTimeId)
        afterScrollTimeId = undefined
      }
      isDropping.value = false
    }

    const isSortOperation = computed<boolean>(
      () =>
        props.groupName === draggableGroup.srcGroup?.groupName &&
        props.groupName === draggableGroup.destGroup?.groupName,
    )

    const listWithDisabledProp = computed<{ item: any; disabled: boolean }[]>(() => {
      const itemKeySet = new Set(props.disabled.itemKeyList ?? [])
      return props.list.map((item, index) => {
        const key = props.getItemKey(item, index)
        return { item, disabled: itemKeySet.has(key) }
      })
    })
    const isAllDisabled = computed<boolean>(() => listWithDisabledProp.value.every((item) => item.disabled))

    const draggableComponentInfo = computed(() => {
      return {
        $el: thisEl.value,
        groupName: props.groupName,
        blockGroup: props.blockGroup,
        disabled: props.disabled,
        draggingInfo,
        dragIn() {
          isDragIn.value = true
        },
        dragOut() {
          isDragIn.value = false
        },
        dragMove(point) {
          const hoverItem = Array.from(
            (thisEl.value as HTMLElement).querySelectorAll('.draggable-item-container'),
          ).find((item) => include(item as HTMLElement, point))
          if (hoverItem) {
            const hoverItemEl = Array.from(hoverItem.querySelectorAll('[data-index]')).find((item) =>
              include(item as HTMLElement, point),
            ) as HTMLElement
            if (hoverItemEl) {
              const hoverItemIndex = Number(toRaw(hoverItemEl).dataset.index)
              if (!listWithDisabledProp.value[hoverItemIndex]?.disabled) {
                hoverIndex.value = hoverItemIndex
                return
              } else if (isAllDisabled.value) {
                hoverIndex.value = 0
                return
              }
            }
          }

          hoverIndex.value = undefined
        },
        getHoverIndex() {
          return hoverIndex.value
        },
        setHoverIndex(index: number) {
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

    const disableIndexGrid = (index: number) => {
      return (
        isDragIn.value &&
        isSortOperation.value &&
        (draggingInfo.index === index || (draggingInfo.index ?? 0) + 1 === index)
      )
    }
    const offsetItemIndex = (index: number) => {
      return isSortOperation.value ? (index < (draggingInfo.index ?? 0) ? index : index - 1) : index
    }

    return {
      isDragIn,
      listWithDisabledProp,
      draggableGroup,
      thisEl,
      scrolling,
      draggingInfo,
      hoverIndex,
      currentChange,
      isSortOperation,
      isDropping,
      draggableComponentInfo,
      disableIndexGrid,
      offsetItemIndex,
      getDataIndex(index: number) {
        return !disableIndexGrid(index) ? { 'data-index': offsetItemIndex(index) } : {}
      },
      startDragging($event: MouseEvent, index: number) {
        const srcElement = closest($event.target as HTMLElement, (el) => el.classList.contains('draggable-item'))
        const draggingEl = draggingInfo.draggingItemContainer as HTMLElement
        const draggingItemTemplate = srcElement?.innerHTML
        const clickPosition = { x: 0, y: 0 }
        const dragging = (event: MouseEvent) => {
          if (clickPosition.x > 3 || clickPosition.y > 3) {
            pressDelayTimeId = setTimeout(() => {
              pressDelayTimeId = undefined
              lastMouseEvent = $event
              const rect = (srcElement as HTMLElement).getBoundingClientRect()
              draggingInfo.index = index
              draggingInfo.srcElement = srcElement
              draggingInfo.draggingItemTemplate = draggingItemTemplate
              draggingInfo.location = [rect.left, rect.top]
              draggableGroup.startDragging(props.groupName)
              emit('startDragging', { index, group: props.groupName })
              nextTick(() => {
                document.body.addEventListener('mousemove', handleDragging)
                document.body.addEventListener('mouseup', handleDropped)
                document.body.classList.add('select-none')
                draggingEl.classList.add('transition-all', 'ease-in')
                draggingEl.style.transitionDuration = `${props.droppingTime}ms`
                const draggingElCenter = getElementCenter(draggingEl)
                draggingInfo.location = [
                  rect.left + ($event.x - draggingElCenter.x),
                  rect.top + ($event.y - draggingElCenter.y),
                ]
                setTimeout(() => {
                  draggingEl.classList.remove('transition-all', 'ease-in')
                  draggingEl.style.transitionDuration = ''
                  document.body.removeEventListener('mousemove', dragging)
                }, props.droppingTime)
              })
            }, props.pressDelay)
          } else {
            clickPosition.x += Math.abs(event.movementX)
            clickPosition.y += Math.abs(event.movementY)
          }
        }
        const mouseup = () => {
          document.body.removeEventListener('mousemove', dragging)
          document.body.removeEventListener('mouseup', mouseup)
        }
        document.body.addEventListener('mousemove', dragging)
        document.body.addEventListener('mouseup', mouseup)
      },
      cancelDraggingDuringDelay() {
        pressDelayTimeId && reset()
      },
      showIndexGrid(index: number) {
        return isDragIn.value && (!isSortOperation.value || index !== draggingInfo.index)
      },
      showAboveDropzone(index: number) {
        return (
          isDragIn.value &&
          (isSortOperation.value
            ? index < (draggingInfo.index ?? 0) && index === hoverIndex.value
            : index === hoverIndex.value)
        )
      },
      showBelowDropzone(index: number) {
        return (
          isDragIn.value &&
          (isSortOperation.value
            ? index > (draggingInfo.index ?? 0) && index === hoverIndex.value
            : index === props.list.length - 1 && props.list.length === hoverIndex.value)
        )
      },
    }
  },
})
</script>

<template>
  <div
    :id="groupName"
    ref="thisEl"
    class="draggable-list flex flex-col overflow-y-auto overflow-x-hidden px-2"
    data-testid="draggable-list"
    data-name="dragCol"
  >
    <TransitionGroup
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-for="(item, index) in listWithDisabledProp"
        :key="getItemKey(item.item, index)"
        class="draggable-item-container"
      >
        <div v-if="showAboveDropzone(index)" class="dropzone-item pb-[0.375rem]" :data-index="hoverIndex">
          <slot name="dropzone" v-bind="{ ...currentChange, ...item }"></slot>
        </div>
        <div
          class="draggable-item relative pb-[0.375rem]"
          @mouseup="cancelDraggingDuringDelay"
          @mouseleave="cancelDraggingDuringDelay"
        >
          <slot
            name="item"
            v-bind="{
              index,
              ...item,
              active: index === draggingInfo?.index,
              startDragging: ($event: MouseEvent) => !item.disabled && startDragging($event, index),
            }"
          ></slot>
          <div v-if="showIndexGrid(index)" class="absolute inset-0 flex flex-col">
            <div class="grow" v-bind="getDataIndex(index)"></div>
            <div class="grow" v-bind="getDataIndex(index + 1)"></div>
          </div>
        </div>
        <div v-if="showBelowDropzone(index)" class="dropzone-item pb-[0.375rem]" :data-index="hoverIndex">
          <slot name="dropzone" v-bind="{ ...currentChange, ...item }"></slot>
        </div>
      </div>
      <slot />
      <div key="dropzone" class="draggable-item-container flex-1 overflow-hidden">
        <div v-if="isDragIn && list.length === 0" class="dropzone-item relative pb-[0.375rem]">
          <slot name="dropzone" v-bind="{ ...currentChange }"></slot>
          <div class="absolute inset-0" :data-index="list.length"></div>
        </div>
        <div class="size-full" :data-index="list.length"></div>
      </div>
    </TransitionGroup>
    <Portal>
      <div class="pointer-events-none fixed inset-0 z-[999999] cursor-grabbing">
        <div
          :ref="(el) => (draggingInfo.draggingItemContainer = el as HTMLElement)"
          data-testId="dragging-item"
          class="dragging-item relative inline-block"
          :style="{
            left: `${draggingInfo.location?.[0] ?? 0}px`,
            top: `${draggingInfo.location?.[1] ?? 0}px`,
          }"
        >
          <slot
            v-if="draggingInfo.index !== undefined"
            name="dragging-item"
            v-bind="{
              isDropping,
              item: list[draggingInfo.index],
              srcElement: draggingInfo.srcElement,
              draggingItemTemplate: draggingInfo.draggingItemTemplate,
              ...currentChange,
            }"
          ></slot>
          <div class="pointer-events-auto absolute left-0 top-0 size-full"></div>
        </div>
      </div>
    </Portal>
  </div>
</template>

<style scoped></style>
