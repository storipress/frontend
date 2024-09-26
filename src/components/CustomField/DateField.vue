<script setup lang="ts">
import { Inputs as SpInput } from '@storipress/core-component'
import { dayjs } from '~/lib/dayjs'

const props = defineProps<{
  label: string
  modelValue: string
  htmlName: string
  time: boolean
}>()
const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const apiValue = useVModel(props, 'modelValue', emit)

// simply just parse the apiValue to date and time part
const parsedValue = computed(() => {
  if (!apiValue.value) {
    return ['', ''] as const
  }

  const day = dayjs.fromDateTimeString(apiValue.value)
  return [day.format('DD/MM/YYYY'), day.format('HH:mm')] as const
})

const formatString = 'DD/MM/YYYY HH:mm'

const dateVal = computed({
  get() {
    return parsedValue.value[0]
  },
  set(val) {
    try {
      // TODO: timezone
      apiValue.value = dayjs(
        `${val} ${props.time ? parsedValue.value[1] || '00:00' : '00:00'}`,
        formatString,
      ).toDateTimeString()
    } catch {
      // TODO: validation
    }
  },
})
const timeVal = computed({
  get() {
    return parsedValue.value[1]
  },
  set(val) {
    try {
      // TODO: timezone
      apiValue.value = dayjs(`${parsedValue.value[0]} ${val}`, formatString).toDateTimeString()
    } catch {
      // TODO: validation
    }
  },
})
</script>

<template>
  <div class="flex gap-x-2">
    <SpInput
      v-model="dateVal"
      :label="label"
      html-type="text"
      :html-name="htmlName"
      placeholder="DD/MM/YY"
      class="w-full"
    />
    <SpInput
      v-if="time"
      v-model="timeVal"
      :label="label"
      html-type="text"
      :html-name="htmlName"
      placeholder="00:00"
      class="w-full"
    />
  </div>
</template>

<style lang="scss" scoped></style>
