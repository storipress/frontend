<script lang="ts" setup>
import IMask from 'imask'
import type { MaskLike } from '../definitions'
import { timeFormat } from '../definitions'
import { dayjs } from './dayjs'
import MaskInput from './mask-input.vue'
import { padDigit, to12hour } from './helpers'
import InputBox from './input-box.vue'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '10:00 AM',
  },
})

const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const initialDate = dayjs(props.modelValue, timeFormat)

const h = initialDate.hour()
const hour = ref(String(to12hour(h)).padStart(2, '0'))
const minute = ref(String(initialDate.minute()).padStart(2, '0'))
const meridiem = ref(initialDate.hour() >= 12 ? 'PM' : 'AM')

function fixMeridiem(value: string, mask: MaskLike) {
  if (!value || value.startsWith('M')) {
    return
  }
  fixOnCommit(value, mask)
}

function fixOnCommit(value: string, masked: MaskLike) {
  if (value === 'AM' || value === 'PM') {
    return
  }
  const possiblyValue = value.toUpperCase().startsWith('P') ? 'PM' : 'AM'
  masked.value = possiblyValue
}

watch([hour, minute, meridiem], (hour, minute, meridiem) => {
  const date = dayjs(`${hour}:${minute} ${meridiem}`, timeFormat)
  emit('update:modelValue', date.format(timeFormat))
})
</script>

<template>
  <InputBox class="w-[4.5rem]">
    <MaskInput
      v-model="hour"
      class="w-4 rounded-l"
      aria-label="hour"
      :readonly="readonly"
      :focus-order="3"
      :opts="{
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
        autofix: 'pad',
        commit: padDigit,
        overwrite: true,
      }"
    /><span>:</span
    ><MaskInput
      v-model="minute"
      class="ml-0.5 w-[1rem]"
      aria-label="minute"
      :readonly="readonly"
      :focus-order="4"
      :opts="{
        mask: IMask.MaskedRange,
        from: 0,
        to: 59,
        maxLength: 2,
        autofix: 'pad',
        commit: padDigit,
        overwrite: true,
      }"
    /><span>&nbsp;</span
    ><MaskInput
      v-model="meridiem"
      class="w-6 rounded-r"
      :readonly="readonly"
      :focus-order="5"
      :opts="{
        mask: '$M',
        autofix: true,
        commit: fixOnCommit,
        blocks: {
          $: {
            mask: IMask.MaskedEnum,
            enum: ['A', 'P', 'a', 'p'],
          } as any,
        },
      }"
      :handle-accept="fixMeridiem"
    />
  </InputBox>
</template>
