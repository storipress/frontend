<script lang="ts" setup>
import type { PropType } from 'vue'
import { defineEmits, defineProps } from 'vue'
import type { AnyMaskedOptions, InputMask } from 'imask'
import { whenever } from '@vueuse/core'
import { useIMask } from './use-imask'
import { useFocusLoop } from '~/composables'

const props = defineProps({
  modelValue: {
    type: String,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  focusOrder: {
    type: Number,
    required: true,
  },
  opts: {
    type: Object as PropType<AnyMaskedOptions>,
    required: true,
  },
  handleAccept: {
    type: Function as PropType<(value: string, mask: InputMask<AnyMaskedOptions>) => void>,
  },
})

const emit = defineEmits<(event: 'update:modelValue', value: string) => void>()

const { el: input } = useIMask({
  initialValue: props.modelValue,
  opts: props.opts,
  onAccept(value, mask) {
    props.handleAccept?.(value, mask)
  },
  onComplete(value) {
    emit('update:modelValue', value)
  },
})

const { focused, focusNext } = useFocusLoop(input, props.focusOrder)

whenever(focused, () => {
  ;(input.value as HTMLInputElement).select()
})
</script>

<template>
  <input
    ref="input"
    :readonly="readonly"
    class="inline-block bg-transparent focus:outline-none"
    @keyup.enter="focusNext"
  />
</template>
