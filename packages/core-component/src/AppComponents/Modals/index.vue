<script lang="ts">
import { defineComponent } from 'vue'
import { DialogOverlay, Dialog as HeadlessuiDialog, TransitionChild, TransitionRoot } from '@headlessui/vue'
import Icon from '../Icon/index.vue'

export default defineComponent({
  name: 'Modals',
  components: {
    HeadlessuiDialog,
    DialogOverlay,
    TransitionChild,
    TransitionRoot,
    Icon,
  },
  props: {
    visible: {
      type: Boolean,
    },
    iconVisible: {
      type: Boolean,
      default: true,
    },
    increaseCloseIcon: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['onModalClose'],

  setup(props, { emit }) {
    function onModalClose() {
      emit('onModalClose')
    }

    return {
      onModalClose,
    }
  },
})
</script>

<template>
  <TransitionRoot :show="visible" as="template">
    <HeadlessuiDialog as="div" static :open="visible" class="fixed inset-0 z-40 overflow-y-auto" @close="onModalClose">
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-stone-800/75 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="duration-100 ease-out"
          enter-from="scale-95 opacity-0"
          enter-to="scale-100 opacity-100"
          leave="duration-75 ease-in"
          leave-from="scale-100 opacity-100"
          leave-to="scale-95 opacity-0"
        >
          <div
            class="layer-2 inline-block transform overflow-visible rounded-lg bg-white text-left align-bottom transition-all sm:my-8 sm:align-middle"
          >
            <div role="button" aria-label="close" class="absolute right-5 top-5" @click="onModalClose">
              <Icon
                v-if="iconVisible"
                icon-name="cross_thin"
                class="text-stone-400"
                :class="increaseCloseIcon ? 'text-[1rem]' : 'text-[0.75rem]'"
              />
            </div>
            <slot />
          </div>
        </TransitionChild>
      </div>
    </HeadlessuiDialog>
  </TransitionRoot>
</template>
