<script lang="ts" setup>
import { Modals } from '@storipress/core-component'
import ModalContent from './ModalContent.vue'
import type { AddTagsModalProps } from './type'

interface Props extends AddTagsModalProps {}
defineOptions({
  name: 'AddTagsModal',
})

withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const modelValue = defineModel<boolean>('modelValue', { default: false })
</script>

<template>
  <Modals :visible="modelValue" @on-modal-close="modelValue = false">
    <ModalContent v-if="modelValue" :group-id="groupId" @close="modelValue = false" />
  </Modals>
</template>
