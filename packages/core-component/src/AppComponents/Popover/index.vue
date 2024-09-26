<script lang="ts" setup>
import { provide, ref } from 'vue'
import { Popover, PopoverButton } from '@headlessui/vue'
import PopoverPanelProvider from './components/PopoverPanelProvider.vue'

const reference = ref()
provide('PopoverParentProvide', reference)
</script>

<template>
  <Popover v-slot="{ open }" ref="reference" class="w-fit">
    <!-- popover button -->
    <PopoverButton class="focus:outline-none">
      <slot />
    </PopoverButton>
    <!-- popover content  -->
    <PopoverPanelProvider :open="open" v-bind="$attrs">
      <slot name="content" />
    </PopoverPanelProvider>
  </Popover>
</template>
