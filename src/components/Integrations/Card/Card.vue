<script lang="ts">
import { defineComponent } from 'vue'
import { HoverHint, Toggles } from '@storipress/core-component'

export default defineComponent({
  name: 'IntegrationCard',
  components: {
    Toggles,
    HoverHint,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    integrationImg: {
      type: String,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: [Boolean, Object] as PropType<boolean | { disabled: boolean; reason: string }>,
      default: false,
    },
  },
  emits: ['onModalOpen', 'onSwitch'],
  setup(props, { emit }) {
    const normalizedDisabled = computed(() => {
      if (typeof props.disabled === 'boolean') {
        return { disabled: props.disabled, reason: '' }
      }

      return props.disabled
    })

    function onClickToggle() {
      if (normalizedDisabled.value.disabled) {
        return
      }
      emit('onSwitch')
    }

    function onModalOpen() {
      if (normalizedDisabled.value.disabled) {
        return
      }
      emit('onModalOpen')
    }

    return {
      onModalOpen,
      onClickToggle,
      isDisabled: computed(() => normalizedDisabled.value.disabled),
      disabledReason: computed(() => normalizedDisabled.value.reason),
    }
  },
})
</script>

<template>
  <div>
    <HoverHint :disabled="!isDisabled || !disabledReason">
      <template #default>
        <div
          role="button"
          class="layer-1 size-40 cursor-pointer rounded-lg p-2 text-center duration-75"
          :class="[enabled && !isDisabled ? 'bg-white' : 'bg-white/20', !isDisabled && 'hover:layer-2']"
          @click="onModalOpen"
        >
          <div class="mb-1 flex justify-end">
            <Toggles type="short" :disabled="isDisabled" :checked="enabled" @on-click="onClickToggle" />
          </div>

          <img class="m-auto w-[4.375rem]" :src="integrationImg" />

          <div class="text-body mt-2 text-stone-600">
            {{ label }}
          </div>
        </div>
      </template>
      <template #content>
        <div class="text-body max-w-sm whitespace-break-spaces text-white">
          {{ disabledReason }}
        </div>
      </template>
    </HoverHint>
  </div>
</template>
