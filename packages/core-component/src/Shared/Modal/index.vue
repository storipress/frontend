<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { DialogTitle } from '@headlessui/vue'
import MyButton from '../../AppComponents/Buttons/index.vue'
import Icon from '../../AppComponents/Icon/index.vue'
import Modals from '../../AppComponents/Modals/index.vue'
import { classname } from './classname'
import type { ModalType } from './definition'

export default defineComponent({
  name: 'Modal',
  components: {
    MyButton,
    Icon,
    Modals,
    DialogTitle,
  },
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: 'Successfully saved! ',
    },
    iconWarpClass: {
      type: String,
    },
    icon: {
      type: String,
    },
    iconClass: {
      type: String,
    },
    okText: {
      type: String,
      default: '',
    },
    okButtonClass: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
    cancelButtonClass: {
      type: String,
      default: '',
    },
    type: {
      type: String as PropType<ModalType>,
      default: '',
      validator: (value: string) => {
        return ['', 'info', 'warning'].includes(value)
      },
    },
  },

  emits: ['onModalClose', 'onConfirm'],

  setup(_, { emit }) {
    const classes = classname
    function onConfirm() {
      emit('onConfirm')
    }
    function onModalClose() {
      emit('onModalClose')
    }

    return {
      classes,
      onConfirm,
      onModalClose,
    }
  },
})
</script>

<template>
  <Modals :visible="visible" @on-modal-close="onModalClose">
    <div class="px-4 pb-4 pt-5 sm:max-w-lg sm:p-6">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
          :class="iconWarpClass ?? classes[type]?.backgroundColor"
        >
          <Icon
            :icon-name="icon ?? classes[type]?.iconName"
            :class="iconClass ?? classes[type]?.textColor"
            class="text-[1.25rem]"
          />
        </div>
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <DialogTitle as="h3" class="text-pageheading text-stone-800">
            {{ title }}
          </DialogTitle>
          <div class="mt-2">
            <p class="text-body text-stone-400">
              <slot />
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
        <MyButton
          :color="type"
          class="inline-flex h-[2.375rem] w-full justify-center px-4 py-2 sm:w-auto"
          :class="okButtonClass"
          @click="onConfirm"
        >
          {{ okText }}
        </MyButton>
        <MyButton
          is-border
          class="mt-3 inline-flex h-[2.375rem] w-full justify-center px-4 py-2 sm:ml-3 sm:mt-0 sm:w-auto"
          :class="cancelButtonClass"
          @click="onModalClose"
        >
          {{ cancelText }}
        </MyButton>
      </div>
    </div>
  </Modals>
</template>
