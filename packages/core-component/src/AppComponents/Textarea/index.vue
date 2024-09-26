<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { useField } from 'vee-validate'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'CustomTextarea',
  components: {},

  props: {
    label: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    textareaId: {
      type: String,
      default: '',
    },
    textareaName: {
      type: String,
      default: '',
    },
    textareaWidth: {
      type: String,
      default: 'w-[31.5rem]',
    },
    textareaHeight: {
      type: String,
      default: 'h-[5.5rem]',
    },
    resize: {
      type: String,
      default: 'resize-none',
    },
    modelValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showError: {
      type: Boolean,
      default: false,
    },
    showCount: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 150,
    },
    countColor: {
      type: String,
      default: 'text-yellow-500',
    },
  },
  emits: ['blur', 'focus', 'update:modelValue'],
  setup(props, { emit }) {
    const textareaContent = useVModel(props, 'modelValue')

    function onBlur() {
      emit('blur')
    }

    function onFocus() {
      emit('focus')
    }

    const { errorMessage, value } = useField(props.textareaName, undefined, {
      initialValue: props.modelValue,
    })
    const valueLength = computed(() => (value.value ? value.value.length : 0))

    watch(
      () => props.modelValue,
      (modelValue) => {
        value.value = modelValue
      },
    )

    return {
      value,
      textareaContent,
      onBlur,
      onFocus,
      errorMessage,
      valueLength,
    }
  },
})
</script>

<template>
  <div class="w-min">
    <label
      v-if="label"
      class="text-body text-stone-800"
      :for="textareaId"
      :class="{ 'opacity-50': errorMessage && showError }"
    >
      {{ label }}
    </label>
    <div class="relative flex">
      <textarea
        :id="textareaId"
        v-model="textareaContent"
        class="text-inputs mt-1 rounded border px-3 pb-[0.56rem] pt-1.5"
        :placeholder="placeholder"
        :name="textareaName"
        :disabled="disabled"
        :class="[
          textareaHeight,
          textareaWidth,
          resize,
          errorMessage && showError
            ? 'border-red-700 opacity-50 focus:border-red-700 focus:ring-red-700'
            : 'border-stone-400 focus:border-sky-600 focus:ring-sky-600',
        ]"
        @blur="onBlur"
        @focus="onFocus"
      />
      <span v-if="showCount" class="text-caption absolute right-0 top-full leading-5 tracking-normal text-stone-500">
        <span :class="[valueLength > maxLength ? countColor : '']">
          {{ valueLength }}
        </span>
        / {{ maxLength }}
      </span>
      <span v-if="errorMessage && showError" class="text-caption absolute bottom-[calc(-1.5_*_1em)] text-red-700">
        <slot :error-message="errorMessage">
          {{ errorMessage }}
        </slot>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
