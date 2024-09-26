<script setup lang="ts">
import { Buttons, SelectTypeahead } from '@storipress/core-component'
import type { ChangeType, SlackChannel } from './definition'
import { SharedLayout } from '~/components/Integrations'

const props = defineProps<{
  integrationImg: string
  integrationData: Record<string, any>
  channelsList: SlackChannel[]
}>()
const emit = defineEmits<{
  'update:integrationData': []
  disconnect: []
  update: []
}>()

const integrationData = useVModel(props, 'integrationData', emit)

const stageChangedChannel = computed(() => selectedChannel(integrationData.value.stage))
const publishedChannel = computed(() => selectedChannel(integrationData.value.published))

function selectedChannel(item: SlackChannel['id'][]) {
  const currentChannel = new Set([...item])
  const result = props.channelsList.filter((channel) => currentChannel.has(channel.id))
  return result
}

function handleChannelsChange(channels: SlackChannel[], type: ChangeType) {
  const result = channels.map((channel) => channel.id)
  integrationData.value[type] = result
}
</script>

<template>
  <SharedLayout>
    <template #content>
      <div class="border-b border-stone-200 p-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img :src="integrationImg" class="mr-4 w-[2.375rem]" />
            <div>
              <p class="text-body mb-0.5 text-stone-800">Slack</p>
              <p class="text-caption text-stone-500">Name of Slack Organization</p>
            </div>
          </div>
        </div>
      </div>

      <div class="border-b border-stone-200 p-5">
        <div class="w-full">
          <div class="text-subheading mb-4">1. Select channel for article stage changes:</div>
          <SelectTypeahead
            :model-value="stageChangedChannel"
            :default-value="stageChangedChannel"
            :items="channelsList"
            option-label-prop="name"
            class="mt-4"
            label="Channel:"
            @update:model-value="($event) => handleChannelsChange($event, 'stage')"
          />
        </div>
      </div>

      <div class="p-5">
        <div class="w-full">
          <div class="text-subheading mb-4">2. Select channel for published articles:</div>
          <SelectTypeahead
            :model-value="publishedChannel"
            :default-value="publishedChannel"
            :items="channelsList"
            option-label-prop="name"
            class="mt-4"
            label="Channel:"
            @update:model-value="($event) => handleChannelsChange($event, 'published')"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <Buttons type="main" color="warning" @click="$emit('disconnect')">Disconnect</Buttons>
      <Buttons type="main" color="primary" class="ml-2" @click="$emit('update')"> Update settings </Buttons>
    </template>
  </SharedLayout>
</template>
