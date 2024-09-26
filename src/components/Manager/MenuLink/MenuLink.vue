<script lang="ts" setup>
import { useFocus, useVModel } from '@vueuse/core'
import { Icon } from '@storipress/core-component'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  blurChange: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['update:modelValue', 'delete', 'change', 'keydown', 'focus', 'blur'])
const input = ref()
const deleteClicked = ref(false)
const inputValue = useVModel(props, 'modelValue', emits)
const { focused } = useFocus(input)
const element = ref()
const targetIsVisible = useElementVisibility(element)

function handleDelete() {
  // there is no need to reset this flag as this component will be unmounted later
  deleteClicked.value = true
  emits('delete')
}

function handleBlur() {
  if (props.blurChange && !deleteClicked.value) {
    emits('change', inputValue)
  }
}

defineExpose({
  focus() {
    if (targetIsVisible.value) {
      focused.value = true
    }
  },
  forceFocus() {
    focused.value = true
  },
})
</script>

<template>
  <div ref="element" class="layer-2 flex h-8 w-72 rounded border-gray-100 bg-stone-100 py-0.5 pl-2 pr-1">
    <input
      ref="input"
      v-model="inputValue"
      class="text-caption mr-1 flex-1 bg-stone-100 focus:outline-none"
      placeholder="Paste link..."
      @keydown.enter="$emit('change', $event)"
      @focus="$emit('focus', $event)"
      @blur="handleBlur"
    />
    <div
      role="button"
      class="ml-auto mr-0 flex cursor-pointer items-center rounded-full px-1.5 transition-colors duration-100 hover:bg-stone-200"
      @click="handleDelete"
      @mousedown="deleteClicked = true"
    >
      <Icon icon-name="delete" class="text-xs text-gray-700" />
    </div>
  </div>
</template>
