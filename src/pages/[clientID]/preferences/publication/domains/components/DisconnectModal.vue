<script setup lang="ts">
import { Buttons, Icon, Modals } from '@storipress/core-component'
import { DialogTitle } from '@headlessui/vue'

withDefaults(
  defineProps<{
    visible: boolean
    loading: boolean
    title: string
    info: string
  }>(),
  {
    visible: false,
    loading: false,
    title: '',
    info: '',
  },
)
defineEmits<{
  (event: 'onModalClose'): void
  (event: 'onConfirm'): void
}>()
</script>

<template>
  <Modals :visible="visible" @on-modal-close="$emit('onModalClose')">
    <div class="px-4 pb-4 pt-5 sm:max-w-lg sm:p-6">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-red-700/[.25] sm:mx-0 sm:size-10"
        >
          <Icon icon-name="link_break" class="text-[1.25rem] text-warning" />
        </div>
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <DialogTitle as="h3" class="text-pageheading text-stone-800">{{ title }}</DialogTitle>
          <div class="mt-2">
            <p class="text-body text-stone-400">
              {{ info }}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
        <Buttons
          color="warning"
          class="inline-flex h-[2.375rem] w-full min-w-[6.7rem] justify-center px-4 py-2 sm:w-auto"
          :is-loading="loading"
          @click="$emit('onConfirm')"
        >
          Disconnect
        </Buttons>
        <Buttons
          is-border
          class="mt-3 inline-flex h-[2.375rem] w-full justify-center px-4 py-2 sm:ml-3 sm:mt-0 sm:w-auto"
          @click="$emit('onModalClose')"
        >
          Cancel
        </Buttons>
      </div>
    </div>
  </Modals>
</template>
