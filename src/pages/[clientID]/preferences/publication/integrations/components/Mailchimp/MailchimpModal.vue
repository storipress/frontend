<script setup lang="ts">
import { Inputs } from '@storipress/core-component'
import type { Mailchimp } from '../../utils'
import { BasicDialog, FormView } from '~/components/Integrations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  isActivated: boolean
  integrationData: Mailchimp
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
      <div class="p-5">
        <div class="mb-3.5 w-full">
          <div class="text-subheading mb-4">1. Enter Email action</div>
          <Inputs
            v-model="integrationData.action"
            label="Mailchimp Action"
            placeholder="e.g. https://hooks.slack.com/services/T2Q91JW9SK192J"
            class="w-full"
            html-type="text"
          />
        </div>
        <span class="text-body text-stone-400">
          Paste action="" attribute contents.
          <a class="text-sky-600" href="https://help.storipress.com" target="_blank" rel="noopener noreferrer prefetch"
            >Here's a tutorial on how to find this code snippet.</a
          >
        </span>
      </div>
    </FormView>
  </BasicDialog>
</template>
