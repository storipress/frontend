<script setup lang="ts">
import { Inputs } from '@storipress/core-component'
import { string as yupString } from 'yup'
import type { Disqus } from '../../utils'
import { BasicDialog, FormView } from '~/components/Integrations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  isActivated: boolean
  integrationData: Disqus
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

const schema = {
  disqusShortname: yupString()
    .default('')
    .test('invalid-shortname', 'Only lower case letters, numbers or hyphens for your shortname', (value) =>
      value ? /^[a-z0-9-]+$/.test(value) : true,
    )
    .nullable()
    .label('Shortname'),
}
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <FormView
      :is-activated="isActivated"
      :validation-schema="schema"
      @activate="$emit('activate')"
      @deactivate="$emit('deactivate')"
      @update="$emit('update')"
    >
      <div class="p-5">
        <div class="mb-3.5 w-full">
          <div class="text-subheading mb-4">1. Enter Disqus shortname</div>
          <Inputs
            v-model="integrationData.shortname"
            label="Disqus Shortname"
            placeholder="xxxxxxxxxxx"
            class="w-full"
            html-name="disqusShortname"
            html-type="text"
          />
        </div>
        <span class="text-body text-stone-400"
          >This shortname is the unique identifier assigned to your Disqus account.
        </span>
      </div>
    </FormView>
  </BasicDialog>
</template>
