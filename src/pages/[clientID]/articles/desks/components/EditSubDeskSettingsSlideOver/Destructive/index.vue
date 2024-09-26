<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import { Icon, Modals, Buttons as SpButton, Select as SpSelect } from '@storipress/core-component'
import type { DeskInterface } from '../definition'
import { classname } from './classname'

export default defineComponent({
  name: 'DestructiveForEditSubDeskSettingsSlideOver',
  components: {
    SpButton,
    SpSelect,
    Icon,
    Modals,
  },
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '',
    },
    confirmValue: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
    desks: {
      type: Array as PropType<Array<DeskInterface>>,
      default: () => [],
    },
  },

  emits: ['onClickDelete', 'onModalClose'],

  setup(props, { emit }) {
    const classes = classname
    const inputValue = ref()

    const allowable = computed(() => {
      return Boolean(inputValue.value)
    })

    function onClickDelete() {
      if (allowable.value) emit('onClickDelete', { ...inputValue.value })
    }

    function onModalClose() {
      emit('onModalClose')
    }

    return {
      classes,
      inputValue,
      allowable,
      onClickDelete,
      onModalClose,
    }
  },
})
</script>

<template>
  <Modals :visible="visible" @on-modal-close="onModalClose">
    <div class="pb-6 pl-6 pr-12 pt-[1.625rem] sm:max-w-lg">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex size-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
          :class="classes.warning.backgroundColor"
        >
          <Icon :icon-name="classes.warning.iconName" :class="classes.warning.textColor" class="text-[1.25rem]" />
        </div>
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <div class="text-pageheading text-stone-800">
            {{ title }}
          </div>
          <div class="mt-4">
            <div
              class="flex h-11 w-full items-center justify-center rounded border border-yellow-500 bg-yellow-500/[.15]"
            >
              <span class="text-caption p-4 text-stone-800">
                Unexpected bad things will happen if you don’t read this!
              </span>
            </div>

            <div class="text-body pb-5 pt-3 text-stone-700">
              <span>This action <strong>cannot</strong> be undone.</span>
              <slot></slot>
            </div>
            <div>
              <span class="text-body text-stone-800"> Please select <strong>a subdesk</strong> </span>
              <SpSelect
                :items="desks"
                option-label-prop="name"
                placeholder="Select a subdesk"
                @update:model-value="inputValue = $event"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
        <SpButton
          is-shadow
          :type="allowable ? 'main' : 'transparent'"
          :is-border="!allowable"
          color="warning"
          class="inline-flex h-[2.375rem] w-full justify-center px-4 py-2 sm:w-full"
          @click="onClickDelete"
        >
          I understand the consequences, {{ buttonText }}
        </SpButton>
      </div>
    </div>
  </Modals>
</template>
