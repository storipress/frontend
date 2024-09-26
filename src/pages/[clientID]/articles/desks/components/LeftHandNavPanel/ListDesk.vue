<script setup lang="ts">
import { SlickItem, SlickList } from '@storipress/vue-slicksort'
import type { DeskDataInterface } from './definition'
import { ListDesksDocument, MoveDeskDocument } from '~/graphql-operations'

const props = defineProps({
  modelValue: {
    type: Array as PropType<DeskDataInterface[]>,
    default: () => [],
  },
  canControlDesk: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (event: 'sortInsert', value: any): void
  (event: 'sortStart', value: any): void
  (event: 'sortEnd', value: any): void
  (event: 'update:modelValue', value: DeskDataInterface[]): void
}>()

const desks = useVModel(props, 'modelValue', emit)

const dragToSub = ref(false)
const targetIndex = ref()
const currentIndex = ref()

function sortMove({ event }: { event: { target: HTMLElement } }) {
  const ROOT_DESK_ID = new Set(['root-desk', 'desk'])
  if (desks.value[currentIndex.value]?.desks?.length) return
  if (!event.target.id) {
    dragToSub.value = true
  } else if (ROOT_DESK_ID.has(event.target.id)) {
    dragToSub.value = false
  }
}

const start = ref(false)
function sortStart($event: { event: MouseEvent; node: HTMLElement; index: number }) {
  start.value = true
  currentIndex.value = $event.index
  emit('sortStart', $event)
}

const { mutate: mutateMoveDesk } = useMutation(MoveDeskDocument)
async function sortEnd($event: { event: MouseEvent; newIndex: number; oldIndex: number }) {
  start.value = false
  if (dragToSub.value) {
    const _currentIndex = currentIndex.value ?? $event.oldIndex ?? 0
    const _targetIndex = targetIndex.value ?? $event.newIndex ?? 0

    if (_currentIndex !== _targetIndex) {
      await mutateMoveDesk(
        { input: { id: desks.value[_currentIndex].id, target_id: desks.value[_targetIndex].id } },
        {
          refetchQueries: [ListDesksDocument],
          awaitRefetchQueries: true,
        },
      )
    }

    dragToSub.value = false
  } else {
    emit('sortEnd', $event)
  }
}

function mouseover(index: number) {
  if (!start.value) return
  targetIndex.value = index
}
</script>

<template>
  <SlickList
    id="root-desk"
    v-model:list="desks"
    class="flex flex-col"
    lock-axis="y"
    group="root"
    :accept="['sub-desk']"
    use-drag-handle
    :get-helper-dimensions="
      ({ node }) => ({
        width: node.offsetWidth,
        height: node.offsetHeight / 2,
      })
    "
    data-intercom-target="Desk List"
    @sort-move="sortMove"
    @sort-insert="$emit('sortInsert', $event)"
    @sort-start="sortStart"
    @sort-end="sortEnd"
  >
    <SlickItem
      v-for="(desk, index) in desks"
      :id="`sub-desk-${index}`"
      :key="desk.id"
      data-testid="sub-desk"
      :disabled="!canControlDesk"
      :index="index"
      class="w-full"
      :class="{
        'rounded-r bg-stone-800/10': !desks[currentIndex]?.desks?.length && dragToSub && index === targetIndex,
      }"
      @mouseover="mouseover(index)"
    >
      <slot v-bind="{ desk, index }" />
      <slot name="subDesks" v-bind="{ desk, index }" />
    </SlickItem>
  </SlickList>
</template>

<style scoped></style>
