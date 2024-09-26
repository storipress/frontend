<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import { DisconnectWordpressDocument, GetWordpressInfoDocument } from '~/graphql-operations'
import { SharedLayout } from '~/components/Integrations'

defineProps<{
  img: string
}>()

const emit = defineEmits<{
  disconnect: []
}>()

const { mutate } = useMutation(DisconnectWordpressDocument, { refetchQueries: [GetWordpressInfoDocument] })

async function onDisconnect() {
  await mutate()
  emit('disconnect')
  // no error handle, throw for sentry to catch
}
</script>

<template>
  <SharedLayout>
    <template #content>
      <div class="p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img :src="img" class="mr-4 w-[2.375rem]" />
            <div>
              <p class="text-body mb-0.5 text-stone-800">WordPress</p>
              <p class="text-caption text-stone-500">Storipress</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <Buttons type="main" color="warning" @click="onDisconnect">Disconnect</Buttons>
    </template>
  </SharedLayout>
</template>
