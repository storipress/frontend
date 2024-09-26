<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref } from 'vue'

import { useBreakpointChange } from './use-breakpoint-change'

const placeholderBlack = 'placeholder-black/25'
const placeholderWhite = 'placeholder-white/45'

// The almost pure css auto resize input
export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'input',
    },

    inputClass: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
    },

    value: {
      type: String,
    },
  },

  setup(props, { emit }) {
    const instance = getCurrentInstance()
    const input = ref<HTMLInputElement>()
    const resizer = ref<HTMLElement>()
    const caretClass = ref('caret-black')
    const placeholderClass = ref(placeholderBlack)

    const displayValue = computed(() => {
      const { value } = props

      if (!value || value === '') {
        return ' '
      }

      if (value.endsWith('\n')) {
        return `${value} `
      }

      return value
    })

    onMounted(() => {
      useBreakpointChange(() => {
        const styles = window.getComputedStyle(findBackgroundProvider(resizer.value!))
        const variant = contrast(styles.backgroundColor)
        caretClass.value = variant === 'dark' ? 'caret-white' : 'caret-black'
        placeholderClass.value = variant === 'dark' ? placeholderWhite : placeholderBlack
      })
    })

    return {
      input,
      resizer,

      placeholderStyle: computed(() => {
        if (props.value) {
          return {}
        }

        return {
          minWidth: `${props.placeholder?.length ?? 8}ch`,
        }
      }),
      caretClass,
      displayValue,
      placeholderClass: computed(() => {
        if (props.inputClass) {
          return props.inputClass
        }

        return placeholderClass.value
      }),
      listeners: computed(() => {
        // filter out input listener here, we need to make it align the native v-model behavior
        const { input, ...listeners } = instance!.proxy.$listeners
        return listeners
      }),

      focus() {
        input.value!.focus()
      },
      handleInput(event: Event | string) {
        const value = typeof event === 'string' ? event : (event.target as HTMLInputElement).value
        emit('input', value)
      },
    }
  },
})
</script>

<template>
  <div class="relative" :class="$style.inherit">
    <div
      ref="resizer"
      :class="[$style.resizer, type === 'textarea' && 'whitespace-pre-wrap']"
      :style="placeholderStyle"
      v-text="displayValue"
    />
    <!-- explict use `textarea` and `input` here to let Vue to understand how to compile it -->
    <textarea
      v-if="type === 'textarea'"
      ref="input"
      :class="[$style.input, caretClass, placeholderClass]"
      :placeholder="placeholder"
      :value="value"
      @input="handleInput"
      v-on="listeners"
    />
    <input
      v-else
      ref="input"
      :class="[$style.input, caretClass, placeholderClass]"
      :placeholder="placeholder"
      :value="value"
      @input="handleInput"
      v-on="listeners"
    />
  </div>
</template>

<style lang="scss" module>
%inherit {
  font-family: inherit;
  font-style: inherit;
  font-weight: inherit;
  text-align: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  line-height: inherit;
}

.inherit {
  @extend %inherit;
}

.resizer {
  @extend %inherit;
  @apply h-max;

  // ! use `em` here, we need to make it same as current font-size
  min-width: 1em;
  min-height: 1em;
  line-height: inherit;

  // a little padding to fix weird line-height issue
  padding-bottom: 3px;
}

.input {
  @extend %inherit;
  @apply h-full w-full resize-none overflow-y-hidden bg-transparent;
  @apply absolute inset-0;
  @apply break-words;
  @apply text-transparent;
  @apply focus:outline-none;
}
</style>
