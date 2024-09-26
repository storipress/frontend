<script lang="ts" setup>
import { Modal } from '@storipress/core-component'
import type { errorModalType } from '../setting'
import { errorModalMapping } from '../setting'
import { useRemoteDialogProvider } from '~/modules/editor/remote-dialog'

interface Tparam {
  type: string
  size?: number
}

const { param, close } = useRemoteDialogProvider('error-notification')
const params = computed(() => (param.value as Tparam) || {})
const content = computed(() => errorModalMapping[params.value.type as errorModalType])
const description = computed(() => {
  if (params.value.type === 'imageLarge') {
    return errorModalMapping[params.value.type].description(Math.round((params.value.size || 0) / 1024 / 1024))
  }
  return content.value.description
})
const open = computed(() => Boolean(params.value.type))
</script>

<template>
  <Modal
    v-if="content"
    type="warning"
    :visible="open"
    :title="content.title"
    ok-text="Close"
    cancel-text="Back"
    @on-confirm="close"
    @on-modal-close="close"
  >
    {{ description }}
  </Modal>
</template>
