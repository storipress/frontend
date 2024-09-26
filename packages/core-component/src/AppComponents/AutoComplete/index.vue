<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SimpleTypeahead from 'vue3-simple-typeahead'
import { ignorableWatch } from '@vueuse/core'
import Icon from '../Icon/index.vue'
import Inputs from '../Inputs/index.vue'

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  inputId: {
    type: String,
    required: false,
  },
  items: {
    type: Array,
    required: true,
  },
  optionLabelProp: {
    type: String,
  },
  modelValue: {
    type: Object || String,
  },
  defaultItem: {
    default: null,
  },
  noMatchMessage: {
    type: String,
    default: 'No match found',
  },
  htmlName: {
    type: String,
  },
  htmlType: {
    type: String,
    default: 'text',
  },
})
const emit = defineEmits<(event: 'update:modelValue', item: object | string) => void>()

const autoInputId = randstr('input-')
function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace('0.', prefix || '')
}

function itemsProjection(item: any) {
  if (props.optionLabelProp) {
    return item[props.optionLabelProp]
  } else {
    return item
  }
}

const optionLabel = computed(() => (item: any) => {
  return props.optionLabelProp ? item[props.optionLabelProp] : item
})

const showNoMatchMessage = ref(false)
const childInputRef = ref()
const inputValue = ref()
const inputRef = ref()
const { ignoreUpdates } = ignorableWatch(inputValue, (val) => {
  childInputRef.value!.input = val
  childInputRef.value.focusInput()
})
function onSelectTypeahead(item: any) {
  emit('update:modelValue', item)
  ignoreUpdates(() => (inputValue.value = optionLabel.value(item)))
  childInputRef.value!.input = ''
  childInputRef.value?.onBlur()
}
watch(
  () => props.modelValue,
  (val) => {
    ignoreUpdates(() => (inputValue.value = optionLabel.value(val)))
  },
)
const listFiltered = ref()
listFiltered.value = props.items

function onInputTypeahead(event: { input: string; items: unknown[] }) {
  inputValue.value = event.input
  listFiltered.value = event.items
}
function onBlurTypeahead(event: { input: string; items: unknown[] }) {
  listFiltered.value = event.items
  showNoMatchMessage.value = false
}

function onFocus() {
  childInputRef.value?.onFocus()
}
function onBlur() {
  childInputRef.value?.onBlur()
}
</script>

<template>
  <div>
    <label v-if="label" :for="inputId || autoInputId" class="text-body mb-1 block text-stone-800">
      {{ label }}
    </label>
    <div class="relative">
      <SimpleTypeahead
        :id="inputId || autoInputId"
        ref="childInputRef"
        :min-input-length="0"
        :items="items"
        :placeholder="placeholder"
        :item-projection="itemsProjection"
        :default-item="defaultItem"
        class="relative after:absolute after:left-0"
        @select-item="onSelectTypeahead"
        @on-input="onInputTypeahead"
        @on-focus="showNoMatchMessage = true"
        @on-blur="onBlurTypeahead"
      >
        <template #list-item-text="{ item, boldMatchText, itemProjection }">
          <slot v-bind="{ item, boldMatchText, itemProjection }">
            <span v-html="boldMatchText(itemProjection(item))" />
          </slot>
          <Icon
            v-if="inputValue === optionLabel(item)"
            icon-name="check"
            class="absolute inset-y-0 top-0 right-0 flex items-center pr-4 text-stone-500"
          />
        </template>
      </SimpleTypeahead>
      <Inputs
        ref="inputRef"
        v-model="inputValue"
        :placeholder="placeholder"
        :html-type="htmlType"
        :html-name="htmlName"
        class="absolute bottom-0 left-0 w-full"
        @focus="onFocus"
        @blur="onBlur"
      />
      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <slot name="suffix">
          <Icon icon-name="selector" class="text-stone-500" />
        </slot>
      </span>
      <div
        v-if="showNoMatchMessage && !listFiltered.length"
        class="simple-typeahead-list text-body px-4 text-stone-800/75"
        style="padding-top: 0.75rem; padding-bottom: 0.75rem"
      >
        <slot name="no-match-message">
          {{ noMatchMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep .simple-typeahead {
  &-input {
    @apply w-full rounded-md border border-stone-400 px-3 pt-1.5 pb-[0.312rem] focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    color: #27272a;
  }
  &-list {
    @apply absolute top-full left-0 z-10 mt-px max-h-60 w-full overflow-scroll rounded-md bg-white py-0.5;
    box-shadow: 5px 10px 30px 0 rgba(0, 0, 0, 0.15);
    &-item {
      @apply relative cursor-pointer py-2 pr-9 pl-4 text-stone-800/75 hover:bg-stone-100;
      font-size: 0.875rem;
      font-weight: normal;
      line-height: 1.25rem;
      &-active {
        @apply bg-stone-100;
      }
    }
  }
}
</style>
