<script lang="ts">
import { defineComponent } from 'vue'
import { Portal, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Icon } from '@storipress/core-component'
import { useEventListener } from './use-event-listener'
import { useOutsideClick } from './use-outside-click'
import { getOwnerDocument } from './owner'

export default defineComponent({
  name: 'SlideOver',
  components: {
    Portal,
    TransitionChild,
    TransitionRoot,
    Icon,
  },
  props: {
    show: Boolean,
    title: String,
    clickOutsideToClose: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close', 'submit', 'afterLeave', 'afterEnter'],
  setup(props, { emit, slots }) {
    const internalDialogRef = ref<HTMLDivElement | null>(null)
    const ownerDocument = computed(() => getOwnerDocument(internalDialogRef.value))
    // Handle outside click
    useOutsideClick(
      internalDialogRef,
      (_event, target) => {
        // debugger
        if (props.show && props.clickOutsideToClose) emit('close')
      },
      2,
    )

    // Handle `Escape` to close
    useEventListener(ownerDocument.value?.defaultView, 'keydown', (event) => {
      if (event.key !== 'Escape') return
      if (!props.show) return
      event.preventDefault()
      event.stopPropagation()
      emit('close')
    })

    return {
      internalDialogRef,
      hasFooter() {
        return Boolean(slots.footer)
      },
    }
  },
})
</script>

<template>
  <TransitionRoot as="template" :show="show">
    <Portal>
      <div
        ref="internalDialogRef"
        class="fixed inset-0 z-30"
        :class="[{ 'pointer-events-none': !clickOutsideToClose }, $attrs.class]"
      >
        <div class="absolute inset-0 overflow-hidden" :class="[{ 'pointer-events-none': !clickOutsideToClose }]">
          <TransitionChild
            v-if="clickOutsideToClose"
            class="opacity-0"
            enter="ease-out duration-500"
            enter-from="opacity-0"
            enter-to="opacity-100"
            entered="opacity-100"
            leave="ease-in-out duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="absolute inset-0" @click="$emit('close')"></div>
          </TransitionChild>
          <div
            class="fixed inset-y-0 right-0 flex max-w-full"
            :class="[{ 'pointer-events-none': !clickOutsideToClose }]"
          >
            <TransitionChild
              class="translate-x-full"
              enter="transform transition ease-out duration-500"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              entered="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
              @after-leave="$emit('afterLeave')"
              @after-enter="$emit('afterEnter')"
            >
              <form
                class="layer-2 relative z-[38] flex h-full w-screen max-w-[calc(100vw-15rem)] flex-col overflow-hidden rounded-tl-[2rem] border border-solid border-gray-100 bg-gray-100"
                :class="[{ 'pointer-events-auto': !clickOutsideToClose }]"
                @submit.prevent="$emit('submit')"
              >
                <div class="slide-over__header relative mx-12 border-b border-stone-200">
                  <slot name="header" :close="() => $emit('close')">
                    <button
                      class="absolute right-[-0.5rem] top-[0.375rem] z-10 inline-flex size-12 items-center justify-center rounded-full outline-none hover:bg-stone-200"
                      type="button"
                      @click="$emit('close')"
                    >
                      <Icon class="text-[1rem] text-[#4c4c4c]" icon-name="cross_thin" />
                    </button>
                    <div class="text-pageheading py-5 text-stone-800">
                      {{ title }}
                    </div>
                  </slot>
                </div>
                <div class="slide-over__body mx-12 flex-shrink flex-grow overflow-auto">
                  <slot :close="() => $emit('close')"></slot>
                </div>
                <div
                  v-if="hasFooter()"
                  class="slide-over__footer flex items-center border-t border-solid bg-white px-6 pb-[0.688rem] pt-[0.562rem]"
                >
                  <slot name="footer" :close="() => $emit('close')"></slot>
                </div>
              </form>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Portal>
  </TransitionRoot>
</template>
