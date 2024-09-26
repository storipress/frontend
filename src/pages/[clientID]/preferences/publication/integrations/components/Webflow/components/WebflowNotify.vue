<script setup lang="ts">
import { Icon } from '@storipress/core-component'

const emit = defineEmits<{
  (event: 'clickNotify'): void
}>()
</script>

<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    appear
  >
    <div aria-live="assertive" class="pointer-events-none fixed inset-0 z-40 flex items-end px-4 py-6">
      <div class="flex w-full flex-col items-center space-y-4">
        <div class="layer-2 pointer-events-auto w-96 overflow-hidden rounded-lg bg-white">
          <div class="px-[1.125rem] pb-4 pt-3">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Icon icon-name="tick_circle" />
              </div>
              <div class="ml-4 w-0 flex-1">
                <p class="text-heading text-neutral-800">Webflow integration ready!</p>
                <div role="button" class="text-button mt-4 text-sky-600" @click="emit('clickNotify')">
                  Complete set up now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
