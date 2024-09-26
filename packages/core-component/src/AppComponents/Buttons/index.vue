<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { mergeTailwind } from '../../plugins/MergeTailwindPlugin'
import { LoadingSpinner } from '../LoadingSpinner'
import { classname } from './classname'
import type { ButtonColor, ButtonHTMLType, ButtonType } from './definition'

export default defineComponent({
  name: 'SpButton',
  components: { LoadingSpinner },
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'main',
      validator: (value: string) => {
        return ['main', 'transparent'].includes(value)
      },
    },
    color: {
      type: String as PropType<ButtonColor>,
      default: '',
      validator: (value: string) => {
        return ['', 'primary', 'info', 'warning'].includes(value)
      },
    },
    isBorder: {
      type: Boolean,
      default: false,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    isShadow: {
      type: Boolean,
      default: false,
    },
    htmlType: {
      type: String as PropType<ButtonHTMLType>,
      default: 'button',
      validator: (value: string) => {
        return ['button', 'submit', 'reset'].includes(value)
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['click'],

  setup(props, { emit }) {
    const isDisabled = computed(() => props.disabled || props.isLoading)
    const classes = computed(() => {
      if (isDisabled.value) {
        return classname.disabled
      } else {
        return props.color ? classname[props.type][props.color] : classname[props.type].default
      }
    })
    const typeClasses = computed(() => {
      return {
        'is-border': props.isBorder,
        'is-dark': props.isDark,
        'layer-1': props.isShadow,
      }
    })
    return {
      classes,
      typeClasses,
      isDisabled,
      onClick() {
        emit('click')
      },
      mergeTailwind,
    }
  },
})
</script>

<template>
  <button
    :type="htmlType"
    :disabled="isDisabled"
    :class="
      mergeTailwind([
        'text-button inline-flex h-9 items-center justify-center rounded px-4 py-2.5 focus:outline-none',
        classes,
        typeClasses,
        $attrs.class,
      ])
    "
    @click="onClick"
  >
    <LoadingSpinner v-if="isLoading" show spin-width="w-5" class="absolute" />
    <span :class="{ invisible: isLoading }" class="flex items-center justify-center">
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped>
.is-dark {
  @apply text-stone-500;
}
.is-border {
  @apply border border-stone-900/[.1];
}
</style>
