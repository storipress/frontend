<script setup lang="ts">
import { SlickItem, SlickList } from '@storipress/vue-slicksort'
import { cloneDeep } from 'lodash-es'
import type { DeskDataInterface } from './definition'

const props = defineProps({
  desk: {
    type: Object as PropType<DeskDataInterface>,
    default: () => ({}),
  },
  canControlDesk: {
    type: Boolean,
    default: false,
  },
  showSubDesk: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (event: 'sortInsert', value: any): void
  (event: 'sortStart', value: any): void
  (event: 'sortEnd', value: any): void
}>()

const subDesks = ref<DeskDataInterface[]>([])
whenever(
  () => props.desk?.desks,
  () => {
    if (props.desk?.desks) {
      subDesks.value = cloneDeep(props.desk.desks).sort((a, b) => a.order - b.order)
    }
  },
  { immediate: true },
)

function sortStart($event: { event: MouseEvent; node: HTMLElement; index: number }) {
  emit('sortStart', $event)
}
</script>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out origin-top"
    enter-from-class="transform scale-y-95 opacity-0"
    enter-to-class="transform scale-y-100 opacity-100"
    leave-active-class="transition duration-75 ease-in origin-top"
    leave-from-class="transform scale-y-100 opacity-100"
    leave-to-class="transform scale-y-95 opacity-0"
  >
    <SlickList
      v-if="showSubDesk"
      v-model:list="subDesks"
      group="sub-desk"
      :accept="({ payload }) => !(payload as DeskDataInterface)?.desks?.length"
      lock-axis="y"
      class="w-full"
      use-drag-handle
      @sort-start="sortStart"
      @sort-end="($event) => $emit('sortEnd', { ...$event, rootDesk: { ...desk, desks: subDesks } })"
      @sort-insert="($event) => $emit('sortInsert', { ...$event, rootDesk: { ...desk, desks: subDesks } })"
    >
      <SlickItem
        v-for="(subDesk, j) in subDesks"
        :key="`${desk.id}-${subDesk.id}`"
        :index="j"
        :disabled="!canControlDesk"
      >
        <slot v-bind="{ subDesk }" />
      </SlickItem>
    </SlickList>
  </transition>
</template>

<style scoped></style>
