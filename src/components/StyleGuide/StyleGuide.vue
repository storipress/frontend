<script setup lang="ts">
import { Buttons, Icon } from '@storipress/core-component'

const props = withDefaults(
  defineProps<{
    errorTitle?: string
    errorDescription?: string
    inEditor?: boolean
    showApply?: boolean
    showDeleted?: boolean
  }>(),
  {
    errorTitle: '',
    errorDescription: '',
    inEditor: false,
    showApply: false,
    showDeleted: false,
  },
)
defineEmits<{
  dismiss: []
  close: []
  apply: []
}>()

const errorTitle = computed(() => {
  if (props.inEditor) {
    return props.errorTitle
  }

  return props.errorTitle ? props.errorTitle : 'Error message title'
})

const showErrorDescription = computed(() =>
  props.errorDescription || props.errorTitle ? props.errorDescription : 'Error message description',
)
</script>

<template>
  <div class="layer-2 flex max-w-72 gap-2 rounded-lg bg-white px-4 py-3.5">
    <div role="button" class="order-last" @click="$emit('close')">
      <span class="sr-only">Close</span>
      <Icon icon-name="cross_thin" class="text-[0.6rem] text-zinc-600" />
    </div>

    <div class="grow">
      <div class="mb-4 flex min-h-16 flex-col gap-y-2">
        <span class="text-heading text-neutral-800">{{ errorTitle }}</span>
        <del v-if="showDeleted" class="text-body text-zinc-600">{{ showErrorDescription }}</del>
        <span v-else class="text-body text-zinc-600">{{ showErrorDescription }}</span>
      </div>
      <div class="flex space-x-2">
        <Buttons v-if="showApply" type="main" is-shadow is-border class="h-7" @click="$emit('apply')">Apply</Buttons>
        <Buttons type="main" is-shadow is-border class="h-7" @click="$emit('dismiss')">Dismiss</Buttons>
      </div>
    </div>
  </div>
</template>
