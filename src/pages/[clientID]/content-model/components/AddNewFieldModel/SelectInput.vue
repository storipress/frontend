<script setup lang="ts">
import { sortBy } from 'remeda'
import { Icon, Inputs } from '@storipress/core-component'
import type { SubmissionHandler } from 'vee-validate'
import { Form as VeeForm } from 'vee-validate'
import { string as yupString } from 'yup'

const props = withDefaults(
  defineProps<{
    // skipcq: JS-0715
    modelValue: Record<string, string>
  }>(),
  { modelValue: () => ({}) },
)

const emit = defineEmits<(event: 'update:modelValue', value: Record<string, string>) => void>()

const choices = useVModel(props, 'modelValue', emit)

const optionSchema = {
  choice: yupString().test('check-tag-unused', 'This option has already been created', (choice) => {
    const options = Object.values(choices.value ?? {})
    const choicesSet = new Set([...options])
    return !choicesSet.has((choice ?? '').trim())
  }),
}

const addChoice: SubmissionHandler = ({ choice }, { setFieldValue }) => {
  if (!choice) return

  const choiceName = (choice as string).trim()
  choices.value = { ...choices.value, [choiceName]: choiceName }
  setFieldValue('choice', '')
}

function deleteChoice(key: string) {
  const data = { ...choices.value }
  Reflect.deleteProperty(data, key)
  choices.value = data
}

const list = computed(() => sortBy(Object.values(choices.value), (tag) => tag.toLowerCase()))
</script>

<template>
  <div>
    <VeeForm class="flex items-start" :validation-schema="optionSchema" @submit="addChoice">
      <Inputs
        class="flex-1"
        label="Add dropdown options"
        placeholder="Type an option and press enter ..."
        html-type="text"
        html-name="choice"
      >
        <template #default="{ errorMessage }">
          <div class="text-caption text-red-700">
            {{ errorMessage }}
          </div>
        </template>
      </Inputs>
    </VeeForm>
    <div class="mt-2 flex flex-wrap items-center gap-1">
      <p
        v-for="choice of list"
        :key="choice"
        class="text-caption flex items-center justify-between rounded bg-[#d8d8d8]/25 px-[.375rem] py-[.125rem]"
      >
        {{ choice }}
        <Icon
          icon-name="cross_thin"
          class="ml-[.285rem] block cursor-pointer text-xs leading-3 text-stone-400"
          @click="deleteChoice(choice)"
        />
      </p>
    </div>
  </div>
</template>
