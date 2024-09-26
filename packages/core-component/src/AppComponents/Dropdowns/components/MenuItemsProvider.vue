<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { computed, inject, onMounted, toRef } from 'vue'
import type { Options, Placement } from '@popperjs/core'
import MenuItems from '../../MenuItems/index.vue'
import { usePopper } from '../../../composables'

const props = defineProps({
  open: {
    type: Boolean,
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'bottom-end',
  },
  classItems: {
    type: String,
    default: '',
  },
  options: {
    type: Object as PropType<Partial<Options>>,
    default: () => ({}),
  },
})

const { reference, popup } = usePopper(
  computed(() => ({
    placement: props.placement,
    strategy: 'fixed',
    ...props.options,
  })),
  toRef(props, 'open'),
)

onMounted(() => {
  const parent = inject<Ref<HTMLElement>>('parentProvide')
  reference.value = parent?.value
})
</script>

<template>
  <div ref="popup" class="z-[52]">
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <slot name="menu" class="[z-52]" :open="open">
        <MenuItems class="min-w-[8.875rem] py-1" :class="classItems" :value="open">
          <slot />
        </MenuItems>
      </slot>
    </transition>
  </div>
</template>

<style scoped></style>
