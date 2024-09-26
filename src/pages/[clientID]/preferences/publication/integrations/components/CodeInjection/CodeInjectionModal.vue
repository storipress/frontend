<script setup lang="ts">
import type { CodeInjection } from '../../utils'
import { validateHTML } from './valid-html'
import CodeTextarea from '~/components/CodeTextarea/CodeTextarea.vue'
import { Integrations, useQueryToggle } from '~/composables'
import { BasicDialog, FormView } from '~/components/Integrations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  isActivated: boolean
  integrationData: CodeInjection
}>()
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:integrationData': []
  deactivate: []
  activate: []
  update: []
}>()

const _visible = useVModel(props, 'modelValue', emit)
const integrationData = useVModel(props, 'integrationData', emit)

const validatedHeader = computed<boolean>(() => {
  return integrationData.value?.header ? validateHTML(integrationData.value?.header) : true
})
const validatedFooter = computed<boolean>(() => {
  return integrationData.value?.footer ? validateHTML(integrationData.value?.footer) : true
})

const { value: visible } = useQueryToggle({
  key: 'integration',
  value: Integrations.HeaderFooterCode,
  syncWith: _visible,
})
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <FormView
      :is-activated="isActivated"
      @activate="validatedHeader && validatedFooter && $emit('activate')"
      @deactivate="$emit('deactivate')"
      @update="validatedHeader && validatedFooter && $emit('update')"
    >
      <div class="flex flex-col border-b border-stone-200 p-5">
        <CodeTextarea
          v-model="integrationData.header"
          textarea-label="Site Header code"
          textarea-id="side-header-code"
        />
        <span v-if="!validatedHeader" class="text-caption text-red-700">
          The header format is not correct. Please enter in HTML formt.
        </span>
      </div>

      <div class="flex flex-col p-5">
        <CodeTextarea
          v-model="integrationData.footer"
          textarea-label="Site footer code"
          textarea-id="side-footer-code"
        />
        <span v-if="!validatedFooter" class="text-caption text-red-700">
          The footer format is not correct. Please enter in HTML formt.
        </span>
      </div>
    </FormView>
  </BasicDialog>
</template>
