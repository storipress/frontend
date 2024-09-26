<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useField } from 'vee-validate'
import { debounce } from 'lodash-es'

export default defineComponent({
  name: 'Inputs',

  props: {
    label: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    addOn: {
      type: Boolean,
      default: false,
    },
    addOnLabel: {
      type: String,
      default: 'https://',
    },
    modelValue: {
      type: String || Number,
      default: '',
    },
    inputId: {
      type: String,
      default: '',
    },
    htmlName: {
      type: String,
      default: 'email',
      required: true,
    },
    htmlType: {
      type: String,
      default: 'email',
    },
    showError: {
      type: Boolean,
      default: true,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showCount: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 60,
    },
    countColor: {
      type: String,
      default: 'text-yellow-500',
    },
  },
  emits: ['update:modelValue', 'input', 'blur', 'focus'],
  setup(props, { emit }) {
    const autoInputId = randstr('input-')
    function randstr(prefix: string) {
      return Math.random()
        .toString(36)
        .replace('0.', prefix || '')
    }

    const errorMessage = ref<string | undefined>()
    const {
      value,
      meta,
      validate,
      errorMessage: veeErrorMessage,
    } = useField(props.htmlName, undefined, {
      initialValue: props.modelValue,
    })
    const valueLength = computed(() => (value.value ? value.value.length : 0))

    const debounceErrorMessage = debounce(async () => {
      const { errors } = await validate()
      errorMessage.value = errors[0]
    }, 500)

    const isTyping = ref(false)
    const autoShowErrorMessage = computed(() => {
      return !isTyping.value && veeErrorMessage.value
    })
    const error = computed(() => autoShowErrorMessage.value || errorMessage.value)

    function onInput(e: Event) {
      isTyping.value = true
      debounceErrorMessage()
      emit('input', e)
    }
    function onBlur() {
      isTyping.value = false
      emit('blur')
    }
    function onFocus() {
      emit('focus')
    }

    // validate may be triggered when the input has not yet entered any value, e.g. submit button
    watch(
      () => meta.validated,
      async (_newVal, preVal) => {
        if (!value.value && !preVal) {
          const { errors } = await validate()
          errorMessage.value = errors[0]
        }
      },
    )
    watch(
      () => props.modelValue,
      (modelValue) => {
        value.value = modelValue
      },
    )
    watch(value, (value) => {
      emit('update:modelValue', value)
    })

    const inputElement = ref()
    onMounted(() => {
      if (props.autofocus) {
        inputElement.value.focus()
      }
    })

    return {
      inputElement,
      autoInputId,
      onInput,
      onBlur,
      onFocus,
      error,
      errorMessage,
      value,
      valueLength,
    }
  },
})
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="inputId || autoInputId"
      class="text-body block text-stone-800"
      :class="{ 'opacity-50': error && showError }"
    >
      {{ label }}
    </label>
    <div :class="{ 'flex rounded-md': addOn, 'mt-1': label }" class="relative">
      <span
        v-if="addOn"
        class="text-inputs inline-flex items-center whitespace-nowrap rounded-l-md border border-r-0 border-stone-400 bg-white px-3 text-stone-800"
      >
        {{ addOnLabel }}
      </span>
      <div class="relative" :class="{ grow: addOn }">
        <input
          :id="inputId || autoInputId"
          ref="inputElement"
          v-model="value"
          :type="htmlType"
          :name="htmlName"
          class="text-inputs block w-full border px-3 pb-[0.312rem] pt-1.5 focus:outline-none focus:ring-1 disabled:opacity-50"
          :class="[
            { 'rounded-none rounded-r-md': addOn },
            { 'rounded-md': !addOn },
            errorMessage && showError
              ? 'border-red-700 opacity-50 focus:border-red-700 focus:ring-red-700'
              : 'border-stone-400 focus:border-sky-600 focus:ring-sky-600',
          ]"
          :placeholder="placeholder"
          :autocomplete="autocomplete"
          :disabled="disabled"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
        />
        <span v-if="showCount" class="text-caption absolute right-0 leading-5 tracking-normal text-stone-500">
          <span :class="[valueLength > maxLength ? countColor : '']">
            {{ valueLength }}
          </span>
          / {{ maxLength }}
        </span>
      </div>
      <slot :error-message="errorMessage">
        <span v-if="error && showError" class="text-caption absolute bottom-[calc(-1.5_*_1em)] text-red-700">
          {{ error }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
