<script lang="ts" setup>
import type { PaginatorControls, TAction, TPage } from './paginationManager'
import { useVModel } from '@vueuse/core'
import { ref, watch } from 'vue'
import PaginationButton from './PaginationButton.vue'
import paginationManager from './paginationManager'

const props = withDefaults(
  defineProps<{
    pageLength: number
    modelValue: number
  }>(),
  {
    pageLength: 1,
    modelValue: 1,
  },
)

const emit = defineEmits<{
  // skipcq JS-0362
  (event: 'update:modelValue', currentPage: number): void
}>()

const current = useVModel(props, 'modelValue', emit)
const paginationItems = ref<TPage[]>([])

const pagination = paginationManager({
  pagesLength: props.pageLength,
  onChange: ({ currentPage, pages }) => {
    current.value = currentPage
    paginationItems.value = pages
  },
})
paginationItems.value = pagination.getPages().pages

watch(
  () => props.pageLength,
  (newPageLength) => {
    if (current.value > newPageLength) current.value = newPageLength
    paginationItems.value = pagination.setPagesLength(newPageLength, current.value).pages
  },
)

watch(
  () => props.modelValue,
  (page) => pagination.setPage(page),
  { immediate: true },
)

function onButtonClick(action: TAction, value: number | PaginatorControls) {
  const newPage = Number(value)
  if (!action || current.value === newPage) return

  pagination[action](newPage)
}
</script>

<template>
  <nav class="relative z-0 inline-flex -space-x-px" aria-label="Pagination">
    <PaginationButton
      v-for="item in paginationItems"
      :key="item.value"
      :is-current="item.isActive ?? false"
      :value="item.value"
      @click="onButtonClick(item.action, item.value)"
    />
  </nav>
</template>
