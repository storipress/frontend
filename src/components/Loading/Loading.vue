<script setup lang="ts">
import { LoadingSpinner } from '@storipress/core-component'
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
import type { LoadingOptions } from '../../composables/loading'

defineProps<{ loadingInfo: LoadingOptions }>()
</script>

<template>
  <div v-if="loadingInfo.show" class="fixed left-0 top-0 z-50 size-full bg-white px-16 py-[5.5rem]">
    <img :src="spLogo" />
    <div class="flex size-full flex-col items-center justify-center">
      <LoadingSpinner :show="loadingInfo.loadingIcon" class="mb-8" />
      <div :class="{ 'pt-24': !loadingInfo.loadingIcon }" class="text-display-x-large text-stone-800">
        {{ loadingInfo.title }}
      </div>
      <div class="mt-8 h-1">
        <transition
          mode="out-in"
          enter-active-class="transition duration-1000 ease-out"
          enter-from-class="transform translate-y-3/4 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-500 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          appear
        >
          <span v-if="loadingInfo.isDescriptionShow" class="text-body block text-center text-stone-500">
            {{ loadingInfo.currentDescription }}
          </span>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
