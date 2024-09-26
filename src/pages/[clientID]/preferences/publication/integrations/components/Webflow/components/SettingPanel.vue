<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { Buttons, Icon, LoadingSpinner, Select } from '@storipress/core-component'
import { useWebflowAuthorized, useWebflowSite } from '../composables'

const emit = defineEmits<{
  (event: 'mapping', type: string): void
  (event: 'updated'): void
  (event: 'disconnect'): void
}>()

const mappingList = [
  { title: 'Map Blog Collection', describe: 'Map your blog collection to Storipress', event: 'blog' },
  { title: 'Map Author Collection', describe: 'Map your author collection to Storipress', event: 'author' },
  { title: 'Map Desk Collection', describe: 'Map your desk collection to Storipress', event: 'desk' },
  { title: 'Map Tag Collection', describe: 'Map your tag collection to Storipress', event: 'tag' },
]

const { domains, selectedDomain, loading: isLoading, updateDomain } = useWebflowSite()
const { disconnectWebflow } = useWebflowAuthorized()

async function onUpdate() {
  await updateDomain()
  emit('updated')
}
async function onDisconnect() {
  await disconnectWebflow()
  emit('disconnect')
}
</script>

<template>
  <div class="layer-1 m-5 rounded-lg bg-gray-100/75">
    <LoadingSpinner v-if="isLoading" show spin-width="w-8" class="absolute left-1/2 top-1/2 z-10" />
    <TabGroup>
      <TabList
        class="text-body relative flex border-b border-gray-300 text-stone-500 transition duration-300 hover:text-black"
      >
        <!-- General Settings Tab -->
        <Tab v-slot="{ selected }" as="template">
          <button
            class="flex justify-center px-5 py-4 outline-none"
            :class="{
              'text-black after:absolute after:bottom-0 after:h-1 after:w-36 after:rounded-t after:bg-emerald-700':
                selected,
            }"
          >
            General Settings
          </button>
        </Tab>

        <!-- Collection Field Mapping Tab -->
        <Tab v-slot="{ selected }" as="template">
          <button
            class="flex justify-center px-5 py-4 outline-none"
            :class="{
              'text-black after:absolute after:bottom-0 after:h-1 after:w-36 after:rounded-t after:bg-emerald-700':
                selected,
            }"
          >
            Collection Field Mapping
          </button>
        </Tab>
      </TabList>

      <TabPanels>
        <!-- General Settings Panel -->
        <TabPanel>
          <div class="w-full p-5">
            <div class="text-subheading mb-4 uppercase">1. Select Domain</div>
            <Select
              v-model="selectedDomain"
              name="webflowDomainId"
              :items="domains"
              label="Select domain"
              placeholder="Select your Webflow domain"
              :disabled="isLoading || domains.length === 0"
              class="w-full"
            />
          </div>
        </TabPanel>

        <!-- Advanced Settings Panel -->
        <TabPanel>
          <div class="w-full">
            <div
              v-for="(item, index) in mappingList"
              :key="item.event"
              class="flex w-full items-center border-stone-200 p-5"
              :class="{ 'border-b': index < mappingList.length - 1 }"
            >
              <div class="flex-1">
                <div class="text-subheading mb-4">{{ item.title }}</div>
                <div class="text-body">{{ item.describe }}</div>
              </div>
              <Buttons
                class="layer-1 text-button flex h-9 items-center justify-center rounded-lg bg-white px-4"
                @click="emit('mapping', item.event)"
              >
                Remapping Fields
                <Icon icon-name="arrow_right" class="ml-2 cursor-pointer px-1 text-xl text-stone-500" />
              </Buttons>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>

  <hr class="border border-stone-200" />

  <div class="flex justify-end gap-2 p-5">
    <Buttons is-shadow type="main" color="warning" :disabled="isLoading" @click="onDisconnect">Disconnect</Buttons>
    <Buttons is-shadow type="main" color="primary" :disabled="isLoading" @click="onUpdate">Update setting</Buttons>
  </div>
</template>
