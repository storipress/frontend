<script lang="ts" setup>
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'radix-vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'

defineProps<{
  open: boolean
}>()
const emits = defineEmits(['modalClose'])
function onModalClose() {
  emits('modalClose')
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <DialogRoot :open="open" @update:open="onModalClose">
      <DialogPortal>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 z-[60] bg-stone-800/75 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <DialogContent
          class="layer-2 fixed left-[50%] top-[50%] z-[60] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white focus:outline-none"
        >
          <slot />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </TransitionRoot>
</template>
