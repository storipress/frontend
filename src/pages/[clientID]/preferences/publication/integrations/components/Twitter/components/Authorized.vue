<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import type { Twitter } from '../../../utils'
import { SharedLayout } from '~/components/Integrations'

defineProps<{
  integrationImg: string
  integrationData: Twitter
}>()
defineEmits<{
  disconnect: []
}>()
</script>

<template>
  <SharedLayout>
    <template #content>
      <div class="p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img :src="integrationImg" class="mr-4 w-[2.375rem]" />
            <div>
              <p class="text-body mb-0.5 text-stone-800">Twitter</p>
              <p class="text-caption text-stone-500">
                {{ integrationData[0].name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <Buttons type="main" color="warning" @click="$emit('disconnect')">Disconnect</Buttons>
    </template>
  </SharedLayout>
</template>
