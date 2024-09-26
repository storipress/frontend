<script setup lang="ts">
import { Dropdowns, Inputs, MenuItem, Textarea } from '@storipress/core-component'
import type { StyleGuideRule } from '../definition'
import type { CreateLinterInput, UpdateLinterInput } from '~/graphql-operations'

const props = defineProps<{
  modelValue: StyleGuideRule
  index: number
  hideDropdown: boolean
  errors: Record<string, string | undefined>
}>()
const emit = defineEmits<{
  deleteRule: []
  changeRule: []
  showPreview: []
  hidePreview: []
  createRule: [val: { input: Omit<CreateLinterInput, 'description'>; key: string }]
  updateRule: [val: { input: Omit<UpdateLinterInput, 'description'> }]
  'update:modelValue': []
}>()

const rule = useVModel(props, 'modelValue', emit)

function onUpdate() {
  if (rule.value.id) {
    const { id, errorTitle, instructions } = rule.value
    emit('updateRule', { input: { id, title: errorTitle, prompt: instructions } })
  } else if (rule.value.key) {
    const { key, errorTitle, instructions } = rule.value
    emit('createRule', {
      input: { title: errorTitle, prompt: instructions },
      key,
    })
  }
  emit('changeRule')
}
</script>

<template>
  <div class="layer-1 relative grid h-fit rounded-lg bg-white p-5">
    <div v-if="!hideDropdown" class="absolute right-2 top-2">
      <Dropdowns placement="left-start" class="w-fit">
        <MenuItem @click="$emit('deleteRule')">Delete rule</MenuItem>
      </Dropdowns>
    </div>

    <div role="form" class="flex flex-col gap-y-4">
      <Inputs
        :model-value="rule.errorTitle"
        label="Error message title"
        placeholder="e.g. Company Name Detected"
        html-type="text"
        :html-name="`styleGuide[${index}].errorTitle`"
        :show-error="Boolean(errors?.[`styleGuide[${index}].errorTitle`])"
        class="w-full"
        @focus="$emit('showPreview')"
        @blur="$emit('hidePreview')"
        @update:model-value="
          ($event) => {
            if ($event === rule.errorTitle) return
            rule.errorTitle = $event
            onUpdate()
          }
        "
      />
      <Textarea
        :model-value="rule.instructions"
        label="A.I. styleguide instructions"
        placeholder="e.g. Do not include any names of Companies"
        html-type="text"
        :textarea-name="`styleGuide[${index}].instructions`"
        :html-name="`styleGuide[${index}].instructions`"
        :show-error="Boolean(errors?.[`styleGuide[${index}].instructions`])"
        show-count
        count-color="text-red-500"
        :max-length="200"
        class="w-full"
        @focus="$emit('showPreview')"
        @blur="$emit('hidePreview')"
        @update:model-value="
          ($event) => {
            if ($event === rule.instructions) return
            rule.instructions = $event
            onUpdate()
          }
        "
      />
    </div>
  </div>
</template>
