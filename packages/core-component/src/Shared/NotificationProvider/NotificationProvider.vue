<script setup lang="ts">
import { nextTick, provide, ref } from 'vue'
import { Portal } from '@headlessui/vue'
import Icon from '../../AppComponents/Icon/index.vue'
import type { NotificationConfig, ProvideContentInterface } from './definition'
import { key } from './definition'

const notificationList = ref<(NotificationConfig & { id: number })[]>([])

const content: ProvideContentInterface = {
  async notify(config) {
    if (config.key) {
      await Promise.all(
        notificationList.value.filter((item) => item.key === config.key).map((item) => item.close && item.close()),
      )
    }
    const id = Math.random()
    const hideNotification = () => {
      nextTick(() => {
        const index = notificationList.value.findIndex((item) => item.id === id)
        notificationList.value.splice(index, 1)
      })
    }
    const timeId = setTimeout(async () => {
      config.close && (await config.close())
      hideNotification()
    }, 5000)
    return new Promise((resolve) => {
      notificationList.value.push({
        ...config,
        id,
        ok: async () => {
          clearTimeout(timeId)
          hideNotification()
          config.ok && (await config.ok())
          resolve(true)
        },
        close: async () => {
          clearTimeout(timeId)
          hideNotification()
          config.close && (await config.close())
          resolve(false)
        },
      })
    })
  },
  notifyForPublishNowAndConfirmUndo({ key, ok, close }) {
    return content.notify({
      key,
      message: 'Article published',
      icon: 'published',
      iconColor: 'text-emerald-600',
      okText: 'Undo',
      cancelText: 'Dismiss',
      ok,
      close,
    })
  },
  notifyForPublishHasScheduledAndConfirmUndo({ key, ok, close }) {
    return content.notify({
      key,
      message: 'This article was scheduled for a date in the past and has been published',
      icon: 'published',
      iconColor: 'text-emerald-600',
      okText: 'Undo',
      cancelText: 'Dismiss',
      ok,
      close,
    })
  },
  notifyForUnpublishAndConfirmUndo({ key, ok, close }) {
    return content.notify({
      key,
      message: 'Article unpublished',
      icon: 'draft',
      iconColor: 'text-[#4c4c4c]',
      okText: 'Undo',
      cancelText: 'Dismiss',
      ok,
      close,
    })
  },
  notifyForDeleteAndConfirmUndo({ key, ok, close }) {
    return content.notify({
      key,
      message: 'Article deleted',
      icon: 'delete',
      iconColor: 'text-[#4c4c4c]',
      okText: 'Undo',
      cancelText: 'Dismiss',
      ok,
      close,
    })
  },
  async closeAll() {
    await Promise.all(
      notificationList.value.map((item) => {
        return item.close && item.close()
      }),
    )
  },
}

provide(key, content)
</script>

<template>
  <slot />
  <Portal>
    <div class="absolute bottom-0 right-0 z-[999999] mb-4 mr-4 flex flex-col items-end space-y-2">
      <transition-group
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <template v-for="item in notificationList" :key="item.id">
          <div
            class="pointer-events-auto w-96 select-none rounded-xl border border-stone-100 bg-white py-[0.875rem] pl-[1.125rem] pr-5 shadow-2-layer"
          >
            <div class="mb-[0.938rem] flex items-center">
              <Icon class="text-[1.125rem]" :class="[item.iconColor]" :icon-name="item.icon" />
              <span class="text-heading mx-4 flex-grow text-stone-800">{{ item.message }}</span>
              <button class="scale-75" @click="item.close">
                <Icon class="text-stone-400" icon-name="cross_thin" />
              </button>
            </div>
            <div class="flex pl-[2.125rem]">
              <button
                type="button"
                class="text-button mr-[1.875rem] rounded-md bg-white text-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                @click="item.ok"
              >
                {{ item.okText }}
              </button>
              <button
                type="button"
                class="text-button rounded-md bg-white text-stone-800 hover:text-stone-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
                @click="item.close"
              >
                {{ item.cancelText }}
              </button>
            </div>
          </div>
        </template>
      </transition-group>
    </div>
  </Portal>
</template>
