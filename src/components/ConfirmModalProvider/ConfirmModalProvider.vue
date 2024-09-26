<script setup lang="ts">
import type { Ref } from 'vue'
import { nextTick, provide, reactive } from 'vue'
import { Modal } from '@storipress/core-component'
import type { ConfirmOptionInterface, ProvideContentInterface } from './definition'
import { key } from './definition'

function randstr(prefix = '') {
  return Math.random().toString(36).replace('0.', prefix)
}

const content = reactive<ProvideContentInterface>({
  modalList: [],
  confirm(option: Ref<ConfirmOptionInterface>) {
    return new Promise((resolve) => {
      const index = content.modalList.length
      content.modalList.push({
        id: randstr(),
        content: {
          title: option.value.title,
          description: option.value.description,
          iconWarpClass: option.value.iconWarpClass,
          icon: option.value.icon,
          iconClass: option.value.iconClass,
          okText: option.value.okText ?? 'Ok',
          okButtonClass: option.value.okButtonClass ?? '',
          cancelText: option.value.cancelText ?? 'Cancel',
          cancelButtonClass: option.value.cancelButtonClass ?? '',
          type: option.value.type ?? 'info',
        },
        visible: false,
        isOk: false,
        onClose() {
          this.visible = false
          if (index > 0) content.modalList[index - 1].visible = true
          setTimeout(() => {
            content.modalList.splice(index, 1)
            resolve(this.isOk)
          }, 150)
        },
      })
      nextTick(() => {
        if (content.modalList.length - 1 === index) {
          content.modalList.forEach((item) => (item.visible = false))
          content.modalList[index].visible = true
        }
      })
    })
  },
})

provide(key, content)
</script>

<template>
  <slot></slot>
  <template v-for="args in content.modalList" :key="args.id">
    <Modal
      class="modal confirm"
      v-bind="args.content"
      :visible="args.visible"
      @on-modal-close="args.onClose()"
      @on-confirm=";(args.isOk = true), args.onClose()"
    >
      <div class="min-w-48">
        <span class="whitespace-pre-line">{{ args.content.description }}</span>
      </div>
    </Modal>
  </template>
</template>

<style lang="scss">
.confirm.modal {
  z-index: 999999;
}
</style>
