<script setup lang="ts">
import { Inputs, Toggles } from '@storipress/core-component'
import type { GoogleAnalytics } from '../../utils'
import { BasicDialog, FormView } from '~/components/Integrations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  isActivated: boolean
  integrationData: GoogleAnalytics
}>()
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:integrationData': []
  deactivate: []
  activate: []
  update: []
}>()

const visible = useVModel(props, 'modelValue', emit)
const integrationData = useVModel(props, 'integrationData', emit)
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <FormView
      :is-activated="isActivated"
      @activate="$emit('activate')"
      @deactivate="$emit('deactivate')"
      @update="$emit('update')"
    >
      <div class="flex items-center justify-between border-b border-stone-200 p-5">
        <div class="w-full">
          <div class="text-subheading mb-4">1. Enter your Google analytics tag</div>
          <Inputs
            v-model="integrationData.tracking_id"
            html-type="text"
            html-name="analytics-tracking-id"
            label="Google Analytics Tracking ID"
            placeholder="e.g. G-DHQEC5HAH9"
            class="w-full"
          />
        </div>
      </div>

      <div class="flex items-center justify-between p-5">
        <div>
          <div class="text-subheading mb-4">2. IP Anonymisation</div>
          <div class="text-body">Anonymise visitor IPs to conform to local data collection laws</div>
        </div>
        <Toggles v-model="integrationData.anonymous" type="simple" />
      </div>
    </FormView>
  </BasicDialog>
</template>
