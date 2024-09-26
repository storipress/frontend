<script lang="ts" setup>
import { Modals } from '@storipress/core-component'
import DialogContent from './DialogContent.vue'
import { useCheckoutDialog } from '~/hooks/useCheckoutDialog'

const { isOpen, closeDialog, doneCheckout } = useCheckoutDialog()

whenever(
  () => isOpen.value,
  () => {
    sendTrack('cta_dialog_opened')
  },
)

function onClose() {
  sendTrack('cta_dialog_canceled')
  closeDialog()
}
function onDone() {
  sendTrack('cta_dialog_completed')
  doneCheckout()
}
</script>

<template>
  <Modals :visible="isOpen" @on-modal-close="onClose">
    <DialogContent v-if="isOpen" @done="onDone" />
  </Modals>
</template>
