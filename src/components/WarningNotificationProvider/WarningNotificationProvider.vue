<script setup lang="ts">
import { nextTick } from 'vue'
import { Dialog, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Icon } from '@storipress/core-component'
import type { MessageInfo, ProvideContentInterface } from './definition'
import { key } from './definition'

const messageInfoList = reactive<MessageInfo[]>([])

const content = reactive<ProvideContentInterface>({
  warn(message: string, { timeout, closable } = { timeout: 3000, closable: true }) {
    messageInfoList.forEach(({ close }) => close())
    const id = Math.random()
    const hideNotification = () => {
      const index = messageInfoList.findIndex((item) => item.id === id)
      if (index === -1) return
      messageInfoList[index].show = false
      nextTick(() => messageInfoList.splice(index, 1))
    }
    const timeId = setTimeout(hideNotification, timeout)
    const close = () => {
      clearTimeout(timeId)
      hideNotification()
    }
    messageInfoList.push({ id, message, show: false, close, closable })
    nextTick(() => {
      messageInfoList[messageInfoList.length - 1].show = true
    })
    return close
  },
})

provide(key, content)
</script>

<template>
  <slot></slot>
  <template v-for="info in messageInfoList" :key="info.id">
    <TransitionRoot as="template" :show="info.show">
      <Dialog as="div" class="pointer-events-none fixed inset-0 z-50 overflow-y-auto">
        <div class="flex h-screen w-screen items-center justify-center text-center">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
            class="flex justify-center"
          >
            <div
              class="pointer-events-auto absolute bottom-4 h-[3.375rem] cursor-pointer rounded border border-gray-100 bg-white shadow-2-layer"
              @click="info.closable && info.close()"
            >
              <div class="flex size-full items-center bg-red-700/5 pl-[1.125rem] pr-2">
                <Icon class="mr-3 size-4 text-red-700" icon-name="warning" />
                <span class="text-body text-red-700">{{ info.message }}</span>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
</template>
