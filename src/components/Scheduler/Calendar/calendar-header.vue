<script lang="ts" setup>
import type { dayjs } from '../ArticleCard/dayjs'
import CalendarPagination from './calendar-pagination.vue'
import ViewSwitch from './view-switch.vue'

const props = defineProps<{ day: dayjs.Dayjs; viewType: string }>()

const emit = defineEmits<{
  (event: 'clickPrevious'): void
  (event: 'clickNext'): void
  (event: 'clickToday'): void
  (event: 'update:viewType', viewType: string): void
}>()

const modelViewType = useVModel(props, 'viewType', emit)
</script>

<template>
  <header class="grid w-full shrink-0 grid-cols-3 p-2">
    <CalendarPagination
      class="self-start"
      @click-next="$emit('clickNext')"
      @click-previous="$emit('clickPrevious')"
      @click-today="$emit('clickToday')"
    />
    <ViewSwitch v-model="modelViewType" class="w-36 justify-self-center" />
    <div class="flex gap-1 justify-self-end">
      <span class="text-[1.375rem] font-semibold leading-7 text-stone-600">{{ day.format('MMMM') }}</span>
      <span class="text-[1.375rem] font-light leading-7 text-red-700">{{ day.year() }}</span>
    </div>
  </header>
</template>
