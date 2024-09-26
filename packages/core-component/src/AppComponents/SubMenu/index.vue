<!-- Dropdown button with submenu -->
<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, ref } from 'vue'
import { MenuItems } from '@headlessui/vue'
import type { Options, Placement } from '@popperjs/core'
import Icon from '../Icon/index.vue'
import { usePopper } from '../../composables'

export default defineComponent({
  name: 'SubMenu',
  components: {
    Icon,
    MenuItems,
  },
  props: {
    title: {
      type: String,
    },
    placement: {
      type: String as PropType<Placement>,
      default: 'right-start',
    },
    options: {
      type: Object as PropType<Partial<Options>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const show = ref(false)
    const { reference, popup } = usePopper(
      {
        placement: props.placement,
        ...props.options,
      },
      show,
    )

    return { reference, popup, show }
  },
})
</script>

<template>
  <div ref="reference" class="block">
    <div
      class="flex items-center justify-between w-full py-2 pl-3.5 pr-2 cursor-pointer hover:bg-stone-100 transition-colors duration-75"
      @mouseover="show = true"
      @mouseleave="show = false"
    >
      {{ title }}
      <Icon icon-name="chevron_right" class="text-[0.6rem]" />
    </div>
  </div>
  <div ref="popup">
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <MenuItems
        v-show="show"
        class="py-2 bg-white rounded-md layer-2 w-max focus:outline-none"
        @mouseover="show = true"
        @mouseleave="show = false"
      >
        <slot />
      </MenuItems>
    </transition>
  </div>
</template>

<style lang="scss" scoped></style>
