<script setup lang="ts">
import { Buttons, Inputs, Select, Toggles } from '@storipress/core-component'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import type { Shopify } from '../../../utils'
import { FormView } from '~/components/Integrations'

const props = defineProps<{
  integrationData: Shopify
  isActivated: boolean
}>()
const emit = defineEmits<{
  'update:integrationData': []
  update: []
  activate: []
  sync: []
}>()

const SHOPIFY_PREFIX = ['a', 'apps', 'community', 'tools']

const integrationData = useVModel(props, 'integrationData', emit)

const splitShopifyPrefix = computed(() => integrationData.value?.prefix.split('/'))

const syncCustomer = computed({
  get() {
    return integrationData.value?.sync_customers ?? true
  },
  set(val: boolean) {
    return (integrationData.value.sync_customers = val)
  },
})

const syncShopifyStablePrefix = computed({
  get() {
    return splitShopifyPrefix.value[1] ?? 'a'
  },
  set(prefix: string) {
    return (integrationData.value.prefix = `/${prefix}/${splitShopifyPrefix.value[2] ?? ''}`)
  },
})

const syncShopifyPrefix = computed({
  get() {
    return splitShopifyPrefix.value[2] ?? ''
  },
  set(prefix: string) {
    return (integrationData.value.prefix = `/${splitShopifyPrefix.value[1] ?? 'a'}/${prefix}`)
  },
})

function onActivateShopify() {
  emit('activate')
}

function onUpdateShopify() {
  emit('update')
}

function onSyncShopifyContent() {
  emit('sync')
}
</script>

<template>
  <FormView>
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
        <!-- Advanced Settings Tab -->
        <Tab v-slot="{ selected }" as="template">
          <button
            class="flex justify-center px-5 py-4 outline-none"
            :class="{
              'text-black after:absolute after:bottom-0 after:h-1 after:w-36 after:rounded-t after:bg-emerald-700':
                selected,
            }"
          >
            Advanced Settings
          </button>
        </Tab>
      </TabList>
      <TabPanels>
        <!-- General Settings Panel -->
        <TabPanel>
          <div class="flex w-full items-center justify-between border-b border-stone-200 p-5">
            <div class="w-full">
              <div class="text-subheading mb-4 uppercase">Set blog SEO Title</div>
              <Inputs
                v-model="integrationData.title"
                placeholder="blog"
                html-name="blogTitle"
                html-type="text"
                label="Configure your blog SEO Title Meta"
                class="mt-3.5 w-full"
              />
            </div>
          </div>

          <!-- Sync Customers to Storipress Emails -->
          <div class="flex w-full items-center justify-between p-5">
            <div>
              <div class="text-subheading mb-4 uppercase">Sync Customers to Storipress Emails</div>
              <p class="text-body text-stone-800">
                Activate the toggle to sync your customers to your email subscribers.
              </p>
            </div>

            <Toggles v-model="syncCustomer" />
          </div>
        </TabPanel>
        <!-- Advanced Settings Panel -->
        <TabPanel class="p-5">
          <div class="flex w-full items-center justify-between">
            <div class="w-full">
              <div class="text-subheading mb-4 uppercase">Configure blog URL</div>
              <Select
                v-model="syncShopifyStablePrefix"
                name="shopifyPrefix"
                :items="SHOPIFY_PREFIX"
                label="Select a Shopify URL prefix"
                class="mb-1 w-full"
              />
              <span class="text-body text-stone-400">
                If this prefix is changed in Shopify, you will also need to update this configuration manually in
                Storipress.
              </span>
              <Inputs
                v-model="syncShopifyPrefix"
                html-name="prefix"
                html-type="text"
                add-on
                :add-on-label="`https://${integrationData.domain}/${syncShopifyStablePrefix}/`"
                label="Configure your URL"
                placeholder="blog"
                class="mt-3.5 w-full"
              />
              <div class="text-caption mt-1 text-stone-400">
                <button class="text-sky-700" @click="onSyncShopifyContent">Click to sync Shopify content</button>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>

    <template #formFooter="{ handleSubmit }">
      <Buttons
        v-if="isActivated"
        type="main"
        color="primary"
        class="mr-2"
        @click="handleSubmit($event, onUpdateShopify)"
      >
        Update settings
      </Buttons>
      <Buttons v-else type="main" color="primary" class="mr-2" @click="handleSubmit($event, onActivateShopify)">
        Activate
      </Buttons>
    </template>
  </FormView>
</template>
