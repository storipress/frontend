<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, ref, toRefs } from 'vue'
import { Icon, mergeTailwind } from '@storipress/core-component'
import { dayjs } from '~/lib/dayjs'
import { GetSiteDocument } from '~/graphql-operations'
import { getWholeMonth } from '~/lib/calendar'

const WEEK_ROW = [0, 1, 2, 3, 4, 5, 6]
const START_DAY_OF_WEEK = dayjs.Ls.en.weekStart ?? 1 // 0 = Sunday, 1 = Monday ...

export default defineComponent({
  name: 'NavbarCalendarDateRangeSelector',
  components: {
    Icon,
  },
  props: {
    modelValue: {
      type: Array as PropType<Date[]>,
      default: () => [],
      required: true,
    },
    defaultDate: {
      type: Object as PropType<dayjs.Dayjs>,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)
    const selectFixedDate = ref<dayjs.Dayjs>()
    const selectHoverDate = ref<dayjs.Dayjs>()

    const daysOfWeek = WEEK_ROW.map(
      (_, index) =>
        dayjs()
          .day((START_DAY_OF_WEEK + index) % 7)
          .format('dd')[0],
    )

    const { result } = useQuery(GetSiteDocument)
    const timezone = computed<string | undefined>(() => result.value?.site.timezone)
    const baseDate = ref(props.defaultDate || dayjs())
    // watch(timezone, () => {
    //   if (timezone.value) baseDate.value = baseDate.value.tz(timezone.value, true)
    // })
    const currentMonth = computed(() => {
      return baseDate.value.format('MMMM YYYY')
    })

    const datesOnPanel = computed(() => {
      return getWholeMonth(baseDate.value, baseDate.value).map(({ day }) => day)
    })
    const startDate = computed(() => {
      if (selectFixedDate.value) {
        if (selectHoverDate.value?.isBefore(selectFixedDate.value)) {
          return selectHoverDate.value
        } else {
          return selectFixedDate.value
        }
      } else if (modelValue.value[0]) {
        return dayjs(modelValue.value[0].valueOf() + -new Date().getTimezoneOffset() * 60 * 1000)
      }

      return undefined
    })
    const endDate = computed(() => {
      if (selectFixedDate.value) {
        if (selectHoverDate.value?.isAfter(selectFixedDate.value)) {
          return selectHoverDate.value
        } else {
          return selectFixedDate.value
        }
      } else if (modelValue.value[1]) {
        return dayjs(modelValue.value[1].valueOf() + new Date().getTimezoneOffset() * 60 * 1000)
      }

      return undefined
    })

    const isCurrentMonth = (date: dayjs.Dayjs) => {
      return date.month() === baseDate.value.month()
    }

    watch(
      () => modelValue.value,
      () => {
        const temp = []
        if (modelValue.value[0]) temp.push(dayjs(modelValue.value[0]))
        if (modelValue.value[1]) temp.push(dayjs(modelValue.value[1]))
        if (temp.length && !temp.some((date) => date.format('MMMM YYYY') === baseDate.value.format('MMMM YYYY'))) {
          baseDate.value = temp[0]
        }
      },
      { immediate: true },
    )

    return {
      baseDate,
      currentMonth,
      daysOfWeek,
      datesOnPanel,
      startDate,
      endDate,
      isCurrentMonth,
      getMonthLabel(date: dayjs.Dayjs) {
        const baseMonth = baseDate.value.month()
        const prefix = baseMonth === date.month() ? 'Current' : baseMonth < date.month() ? 'Next' : 'Prev'
        return `${prefix} Month ${date.format('D/MM/YYYY')}`
      },
      moveMonth(increment: number) {
        baseDate.value = baseDate.value.add(increment, 'month')
      },
      handleClickDate(date: dayjs.Dayjs) {
        if (isCurrentMonth(date)) {
          if (selectFixedDate.value) {
            emit('update:modelValue', [
              startDate.value?.startOf('date').tz(timezone.value, true).toDate(),
              endDate.value?.endOf('date').tz(timezone.value, true).toDate(),
            ])
            selectFixedDate.value = undefined
            selectHoverDate.value = undefined
          } else {
            selectFixedDate.value = date
          }
        } else {
          baseDate.value = date
        }
      },
      previewSelect(date: dayjs.Dayjs) {
        selectHoverDate.value = date
      },
      isStartDate(date: dayjs.Dayjs) {
        return startDate.value?.isSame(date, 'date') ?? false
      },
      isEndDate(date: dayjs.Dayjs) {
        return endDate.value?.isSame(date, 'date') ?? false
      },
      isInRange(date: dayjs.Dayjs) {
        return (
          startDate.value &&
          endDate.value &&
          date.isAfter(startDate.value, 'date') &&
          date.isBefore(endDate.value, 'date')
        )
      },
      clear() {
        emit('update:modelValue', [])
        selectFixedDate.value = undefined
        selectHoverDate.value = undefined
      },
      mergeTailwind,
    }
  },
})
</script>

<template>
  <div :class="mergeTailwind($attrs.class)">
    <div class="z-[21] mb-3 flex items-center justify-center">
      <button
        class="flex size-5 items-center justify-center rounded-full border border-solid border-stone-400"
        type="button"
        aria-label="To Previous month"
        @click="moveMonth(-1)"
      >
        <Icon icon-name="chevron_left" class="text-4 size-4 scale-50 leading-4 text-stone-400" />
      </button>
      <span :class="mergeTailwind('text-body mx-5 w-[6.875rem] text-center text-stone-600')">
        {{ currentMonth }}
      </span>
      <button
        class="flex size-5 items-center justify-center rounded-full border border-solid border-stone-400"
        type="button"
        aria-label="To Next Month"
        @click="moveMonth(1)"
      >
        <Icon icon-name="chevron_right" class="text-4 size-4 scale-50 leading-4 text-stone-400" />
      </button>
    </div>
    <div class="flex w-[17.5rem] flex-wrap">
      <div
        v-for="day in daysOfWeek"
        :key="`day-${day}`"
        :class="mergeTailwind('text-subheading flex h-9 w-10 items-center justify-center opacity-50')"
      >
        {{ day }}
      </div>
      <button
        v-for="(date, index) in datesOnPanel"
        :key="`day-${Math.floor(index / 7)}-${index % 7}`"
        :aria-label="getMonthLabel(date)"
        :class="
          mergeTailwind([
            'text-subheading flex h-9 w-10 items-center justify-center duration-100 ease-in-out hover:bg-sky-600/20',
            { 'opacity-20': !isCurrentMonth(date) },
            { 'bg-sky-600/20': isCurrentMonth(date) && isInRange(date) },
            {
              'rounded-l-lg bg-sky-700 text-white hover:bg-sky-700': isCurrentMonth(date) && isStartDate(date),
            },
            {
              'rounded-r-lg bg-sky-700 text-white hover:bg-sky-700': isCurrentMonth(date) && isEndDate(date),
            },
          ])
        "
        @click="handleClickDate(date)"
        @mouseenter="previewSelect(date)"
      >
        {{ date.date() }}
      </button>
    </div>
    <div class="px-2 pt-4">
      <button
        :class="
          mergeTailwind(
            'layer-1 text-subheading rounded border border-solid border-stone-900/10 px-4 pb-[0.188rem] pt-[0.321rem] text-stone-800 hover:text-sky-600',
          )
        "
        @click="clear"
      >
        Clear
      </button>
    </div>
  </div>
</template>
