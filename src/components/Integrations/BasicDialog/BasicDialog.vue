<script setup lang="ts">
import { Modals } from '@storipress/core-component'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    img?: string
    integrationName: string
    info: string
  }>(),
  { img: '' },
)
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  closeModel: []
}>()

const visible = useVModel(props, 'modelValue', emit)

function onCloseModel() {
  visible.value = false
  emit('closeModel')
}
</script>

<template>
  <Modals :visible="visible" increase-close-icon @on-modal-close="onCloseModel">
    <div class="layer-2 w-[40rem] rounded-lg bg-white">
      <div class="flex border-b border-stone-200 p-5">
        <slot name="icon">
          <img class="mr-4 size-11" :src="img" />
        </slot>
        <div class="flex flex-col">
          <span class="text-display-small pb-1 text-stone-800">
            <slot name="label">
              {{ integrationName }}
            </slot>
          </span>
          <span class="text-heading text-stone-400">{{ info }}</span>
        </div>
      </div>

      <div data-testid="model-content">
        <slot v-bind="{ onCloseModel }" />
      </div>
    </div>
  </Modals>
</template>
