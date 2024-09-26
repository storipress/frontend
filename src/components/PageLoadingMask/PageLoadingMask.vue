<script setup lang="ts">
import { Dialog, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { mergeTailwind } from '@storipress/core-component'

defineProps({
  cover: {
    type: Boolean,
  },
  visible: {
    type: Boolean,
  },
})
</script>

<template>
  <TransitionRoot as="template" :show="cover">
    <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex h-screen w-screen items-center justify-center text-center">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            :class="
              mergeTailwind(['fixed inset-0 transition-opacity', { 'bg-stone-800/[.75] bg-opacity-75': visible }])
            "
          />
        </TransitionChild>
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <slot name="loading-icon"></slot>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
