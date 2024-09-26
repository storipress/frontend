<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import SpButton from '../../AppComponents/Buttons/index.vue'
import SpInput from '../../AppComponents/Inputs/index.vue'
import Icon from '../../AppComponents/Icon/index.vue'
import Modals from '../../AppComponents/Modals/index.vue'
import LoadingSpinner from '../../AppComponents/LoadingSpinner/index.vue'
import { classname } from './classname'

export default defineComponent({
  name: 'Destructive',
  components: {
    SpButton,
    SpInput,
    Icon,
    Modals,
    LoadingSpinner,
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
    inputType: {
      type: String,
      default: 'text',
    },
    inputName: {
      type: String,
      default: 'destructiveInput',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    errorProof: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['onClickDelete', 'onModalClose'],

  setup(props, { emit }) {
    const classes = classname
    const inputValue = ref('')

    const allowable = computed(() => {
      return inputValue.value === props.confirmValue
    })

    const isDisabled = computed(() => {
      return props.loading || (props.errorProof && !allowable.value) || !inputValue.value
    })

    function onClickDelete() {
      if (props.loading || !inputValue.value) return
      if (props.errorProof) {
        allowable.value && emit('onClickDelete')
      } else {
        emit('onClickDelete', inputValue.value)
      }
    }

    function onModalClose() {
      emit('onModalClose')
      inputValue.value = ''
    }

    return {
      classes,
      inputValue,
      isDisabled,
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
          class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
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
              <slot />
            </div>
            <div>
              <span class="text-body text-stone-800">
                Type
                <strong>{{ confirmValue }}</strong>
                to confirm:
              </span>
              <SpInput
                v-model="inputValue"
                :disabled="loading"
                :placeholder="confirmValue"
                :html-type="inputType"
                :html-name="inputName"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
        <SpButton
          is-shadow
          :type="isDisabled ? 'transparent' : 'main'"
          :is-border="isDisabled"
          color="warning"
          class="inline-flex h-[2.375rem] w-full justify-center px-4 py-2 sm:w-full"
          aria-label="submit"
          @click="onClickDelete"
        >
          <LoadingSpinner v-if="loading" show spin-width="w-5" />
          <span v-else>I understand the consequences, {{ buttonText }}</span>
        </SpButton>
      </div>
    </div>
  </Modals>
</template>
