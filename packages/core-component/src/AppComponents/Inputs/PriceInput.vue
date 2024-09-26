<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useFocus } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    prefix?: string
    suffix?: string
    inputId?: string
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: '',
    prefix: '',
    suffix: 'string',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'blur'): void
  (event: 'focus'): void
}>()

const autoInputId = randstr('input-')
function randstr(prefix: string) {
  return (
    Math.random()
      .toString(36)
      .replace('0.', prefix || '') + Date.now()
  )
}

const inputRef = ref<HTMLInputElement>(document.createElement('input')) as Ref<HTMLInputElement>
const { focused } = useFocus(inputRef)
watch(focused, (focused) => {
  inputRef.value.value = props.modelValue
  if (focused) {
    emit('focus')
  } else {
    emit('blur')
  }
})

const inputValue = computed({
  get() {
    return props.modelValue.replace(/((^\d*\.\d{2}).*)|e/, (_, g1, g2) => (g1 ? g2 : ''))
  },
  set(newValue) {
    const value = String(newValue).replace(/((^\d*\.\d{2}).*)|e/, (_, g1, g2) => (g1 ? g2 : ''))
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <div class="flex-1">
    <label v-if="label" :for="inputId || autoInputId" class="text-body mb-1 block text-stone-800">
      {{ label }}
    </label>

    <div
      class="text-inputs flex items-center rounded-md border border-stone-400 bg-white ring-sky-600 focus-within:border-sky-600 focus-within:ring-1"
    >
      <div class="text-inputs pl-3">
        {{ props.prefix }}
      </div>
      <input
        :id="inputId || autoInputId"
        ref="inputRef"
        v-model="inputValue"
        :placeholder="props.placeholder"
        type="number"
        min="0.01"
        step=".01"
        class="text-inputs block w-0 flex-1 py-1.5 placeholder-stone-400 outline-none"
      />
      <div class="text-inputs pr-3 text-stone-400">
        {{ props.suffix }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
