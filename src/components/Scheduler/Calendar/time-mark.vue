<script lang="ts" setup>
import type { dayjs } from '~/lib/dayjs'

const props = defineProps<{
  hour: number
  mark: string
  currentDay: dayjs.Dayjs
}>()

const currentHour = computed(() => props.currentDay.hour())
const top = computed(() => (props.currentDay.minute() / 60) * 100)
const currentTime = computed(() => props.currentDay.format('h:mm a'))
</script>

<template>
  <div class="pointer-events-none relative z-0 col-start-1 col-end-2 row-start-1 size-full">
    <!-- left time mark -->
    <div class="text-caption sticky left-0 top-0 -ml-14 -mt-4 w-14 pr-2 text-right text-stone-800">
      {{ mark }}
    </div>
    <!-- right time mark -->
    <div class="text-caption sticky right-0 top-0 -mr-14 -mt-4 ml-auto w-14 pl-2 text-left text-stone-800">
      {{ mark }}
    </div>
    <!-- 1/2 day line -->
    <hr class="absolute inset-x-0 top-1/2 w-full border-gray-100" />

    <!-- current time line -->
    <div
      v-if="hour === currentHour"
      class="absolute inset-x-0 z-0 w-full border-t border-red-700"
      :style="{ top: `${top}%` }"
    >
      <div class="text-caption -ml-14 -mt-2 font-bold text-stone-800">
        {{ currentTime }}
      </div>
    </div>
  </div>
</template>
