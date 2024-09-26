<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import SharedLayout from '../SharedLayout/SharedLayout.vue'

withDefaults(
  defineProps<{
    integrationImg: string
    text?: string
  }>(),
  {
    text: 'Connect an account',
  },
)
defineEmits<{
  connect: []
  back: []
}>()
</script>

<template>
  <SharedLayout>
    <template #content>
      <div class="p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img :src="integrationImg" class="mr-4 w-[2.375rem]" />
            <p class="text-body mb-0.5 text-stone-800">{{ text }}</p>
          </div>
          <Buttons is-shadow @click="$emit('connect')">Connect Account</Buttons>
        </div>
      </div>
    </template>

    <template #outsideContent>
      <slot name="outsideContent" />
    </template>

    <template #footer>
      <Buttons is-shadow @click="$emit('back')">Back</Buttons>
    </template>
  </SharedLayout>
</template>
