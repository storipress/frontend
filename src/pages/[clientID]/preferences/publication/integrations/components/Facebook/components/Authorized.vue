<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import type { Facebook } from '../../../utils'
import { SharedLayout } from '~/components/Integrations'

defineProps<{
  integrationImg: string
  integrationData: Facebook
}>()
defineEmits<{
  disconnect: []
}>()
</script>

<template>
  <SharedLayout>
    <template #content>
      <div
        v-for="userData in integrationData"
        :key="userData.page_id"
        class="layer-1 mb-4 rounded-lg bg-gray-100/75 last:mb-0"
      >
        <div class="p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <img :src="integrationImg" class="mr-4 w-[2.375rem]" />
              <div>
                <p class="text-body mb-0.5 text-stone-800">Facebook Business</p>
                <p class="text-caption text-stone-500">{{ userData.name }}</p>
              </div>
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
