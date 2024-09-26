<script lang="ts" setup>
import { SlickList } from '@storipress/vue-slicksort'
import { setHelperStyle } from './helpers'
import type { SortInput } from './definitions'
import { usePublicationPermission } from '~/composables/permission/publication'

const props = defineProps<{
  group: 'scheduler-navigation' | 'scheduler-calendar'
  modelValue: unknown[]
  dragActive?: boolean
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: unknown[]): void
  (event: 'update:dragActive', value: boolean): void
  (event: 'sortEnd', value: SortInput): void
  (event: 'sortRemove', value: { oldIndex: number }): void
}>()

const { canUnpublishedArticle, canPublishedArticle } = usePublicationPermission()
const modelDragActive = useVModel(props, 'dragActive', emit)
const list = useVModel(props, 'modelValue', emit)
const accept = computed((): string[] | false => {
  if (props.group === 'scheduler-navigation') {
    return canUnpublishedArticle.value && ['scheduler-calendar']
  } else {
    return canPublishedArticle.value && ['scheduler-navigation']
  }
})

function active() {
  modelDragActive.value = true
}

function inactive() {
  modelDragActive.value = false
}
</script>

<template>
  <SlickList
    v-model:list="list"
    :group="group"
    :accept="accept"
    helper-class="bg-white rotate-12 ease-out z-10"
    :transition-duration="100"
    :set-helper-style="setHelperStyle"
    :press-delay="100"
    @drag-in="active"
    @drag-out="inactive"
    @drag-end="inactive"
    @sort-end="$emit('sortEnd', $event)"
    @sort-insert="$emit('sortEnd', $event)"
    @sort-remove="$emit('sortRemove', $event)"
  >
    <slot />
  </SlickList>
</template>
