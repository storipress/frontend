<script lang="ts" setup>
import { computed } from 'vue'
import Icon from '../Icon/index.vue'
import { cn } from '../../plugins/MergeTailwindPlugin'
import { PaginatorControls } from './paginationManager'

const props = withDefaults(
  defineProps<{
    isCurrent: boolean
    value: number | PaginatorControls | 'Next'
  }>(),
  {
    isCurrent: false,
    value: PaginatorControls.Ellipsis,
  },
)

const isValueItem = computed(() => props.value !== PaginatorControls.Next && props.value !== PaginatorControls.Prev)
</script>

<template>
  <a
    href="#"
    aria-current="page"
    :class="
      cn(
        'text-body relative flex w-10 items-center justify-center border bg-white py-2 text-center text-stone-500 transition-colors duration-100 hover:bg-stone-50',
        {
          'z-10 border-sky-700 bg-sky-700/10 text-sky-700': props.isCurrent,
          'rounded-bl-lg rounded-tl-lg': props.value === PaginatorControls.Prev,
          'rounded-br-lg rounded-tr-lg': props.value === PaginatorControls.Next,
        },
      )
    "
    @click.prevent
  >
    <Icon v-if="props.value === PaginatorControls.Prev" class="text-xs" icon-name="chevron_left" />
    <Icon v-if="props.value === PaginatorControls.Next" class="text-xs" icon-name="chevron_right" />
    <span v-if="isValueItem">{{ props.value }}</span>
  </a>
</template>
