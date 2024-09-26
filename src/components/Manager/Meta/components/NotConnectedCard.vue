<script lang="ts" setup>
import { Buttons } from '@storipress/core-component'
import type { SocialMedia } from '../utils'
import { mediaSetting } from '../utils'

defineProps<{ mediaName: SocialMedia; connected: boolean; iconSrc: string }>()
const emit = defineEmits(['connect', 'activate'])

function handleConnect() {
  emit('connect')
}

function handleActiveate() {
  emit('activate')
}
</script>

<template>
  <div class="layer-0 flex w-full flex-col items-center bg-white p-4">
    <div class="text-heading flex flex-col items-center">
      ✨Automagically✨ post your article
      <div>{{ mediaSetting[mediaName].postText }}</div>
    </div>
    <div class="relative mb-4 ml-14 w-28">
      <img :src="iconSrc" class="w-full" />
    </div>
    <Buttons
      type="main"
      color="primary"
      is-shadow
      class="w-full"
      @click="connected ? handleActiveate() : handleConnect()"
    >
      {{ connected ? 'Activate ' : 'Connect to ' }}
      {{ mediaSetting[mediaName].buttonText }}
    </Buttons>
  </div>
</template>
