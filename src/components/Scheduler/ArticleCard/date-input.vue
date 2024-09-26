<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import IMask from 'imask'
import { dateFormat } from '../definitions'
import { dayjs } from './dayjs'
import MaskInput from './mask-input.vue'
import { padDigit } from './helpers'
import InputBox from './input-box.vue'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: () => {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yy = String(today.getFullYear())
      return `${dd}/${mm}/${yy}`
    },
  },
})

const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const initialDate = dayjs(props.modelValue, dateFormat)

const year = ref(String(initialDate.year()))
const month = ref(String(initialDate.month() + 1).padStart(2, '0'))
const day = ref(String(initialDate.date()).padStart(2, '0'))

watch([day, month, year], (day, month, year) => {
  const date = dayjs(`${day}/${month}/${year}`, dateFormat)
  emit('update:modelValue', date.format(dateFormat))
})
</script>

<template>
  <InputBox class="w-[5.6rem]">
    <MaskInput
      v-model="day"
      class="w-[1.05rem] rounded-l"
      aria-label="day"
      :readonly="readonly"
      :focus-order="0"
      :opts="{
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2,
        autofix: true,
        commit: padDigit,
        overwrite: true,
      }"
    /><span>/</span
    ><MaskInput
      v-model="month"
      class="ml-0.5 w-[1.1rem]"
      aria-label="month"
      :readonly="readonly"
      :focus-order="1"
      :opts="{
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
        autofix: 'pad',
        commit: padDigit,
        overwrite: true,
      }"
    /><span>/</span
    ><MaskInput
      v-model="year"
      class="ml-0.5 w-8 rounded-r"
      aria-label="year"
      :readonly="readonly"
      :focus-order="2"
      :opts="{
        mask: IMask.MaskedRange,
        from: 1900,
        to: 9999,
        maxLength: 4,
        overwrite: true,
      }"
    />
  </InputBox>
</template>
