<!-- Dropdown button container -->
<script lang="ts">
import { defineComponent, watch } from 'vue'
import { MenuItems } from '@headlessui/vue'

export default defineComponent({
  name: 'SpMenuItems',
  components: {
    MenuItems,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    watch(
      () => props.value,
      () => {
        emit('change', props.value)
      },
    )
  },
})
</script>

<template>
  <MenuItems class="bg-white rounded-lg layer-2 w-max focus:outline-none text-body text-stone-600">
    <slot />
  </MenuItems>
</template>

<style></style>
