<script lang="ts" setup>
import { ref } from 'vue'
import type { FloatProps } from '@headlessui-float/vue'
import { logicAnd, logicNot } from '@vueuse/math'
import { Float } from '@headlessui-float/vue'
import { useElementHover } from '@vueuse/core'

defineOptions({
  name: 'HoverHint',
})

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  flip: true,
  placement: 'top',
  referenceClass: '',
  popupClass: '',
})

defineSlots<{ default: () => void; content: () => void }>()

type HoverHintFloatProps = Pick<FloatProps, 'flip' | 'offset' | 'placement' | 'shift' | 'middleware' | 'zIndex'>

interface Props extends HoverHintFloatProps {
  disabled?: boolean
  referenceClass?: string
  popupClass?: string
}

const floatProps = computed(() => {
  const { disabled, referenceClass, popupClass, ...rest } = props
  return rest
})

const isHover = ref(false)
const show = computed(() => {
  if (props.disabled) {
    return false
  }

  return isHover.value
})
</script>

<template>
  <Float
    v-bind="floatProps"
    :show="show"
    enter-from="opacity-0"
    enter="transition-opacity delay-300 duration-200 ease-in-out"
    enter-to="opacity-100"
    tailwindcss-origin-class
  >
    <div class="inline-block" :class="referenceClass" @mouseenter="isHover = true" @mouseleave="isHover = false">
      <slot />
    </div>
    <div
      class="layer-2 text-caption z-40 flex w-max items-center rounded bg-stone-700 px-2 py-1 text-center text-white"
      :class="popupClass"
    >
      <slot name="content" />
    </div>
  </Float>
</template>
