<!-- dropdown button -->
<script lang="ts" setup>
import { Menu as HeadlessuiMenu, MenuButton } from '@headlessui/vue'
import Icon from '../Icon/index.vue'
import MenuItemsProvider from './components/MenuItemsProvider.vue'

defineOptions({
  name: 'Dropdowns',
})

defineProps({
  isVertical: {
    type: Boolean,
    default: false,
  },
})

const reference = ref()
provide('parentProvide', reference)
</script>

<template>
  <HeadlessuiMenu v-slot="{ open }" ref="reference" as="div" class="relative inline-block text-left">
    <slot name="button" :open="open">
      <MenuButton
        aria-label="open-dropdown"
        class="text-body inline-flex w-full justify-start rounded-full bg-white p-1.5 text-stone-800 transition-colors duration-75 hover:bg-stone-50 focus:outline-none"
      >
        <Icon
          :icon-name="isVertical ? 'dots_vertical' : 'dots_horizontal'"
          class="cursor-pointer text-[1.125rem] text-stone-600"
        />
      </MenuButton>
    </slot>

    <MenuItemsProvider :open="open" v-bind="$attrs" data-testid="dropdown-menu">
      <slot />
    </MenuItemsProvider>
  </HeadlessuiMenu>
</template>
