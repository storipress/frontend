<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import { SharedLayout } from '~/components/Integrations'
import type { LinkedInConfiguration } from '~/graphql-operations'

defineProps<{
  integrationImg: string
  integrationData: LinkedInConfiguration
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
              <p class="text-body mb-0.5 text-stone-800">LinkedIn</p>
              <p class="text-caption text-stone-500">
                {{ integrationData.name }}
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
