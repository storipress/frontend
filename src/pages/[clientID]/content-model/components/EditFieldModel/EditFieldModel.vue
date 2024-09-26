<script setup lang="ts">
import type { PropType } from 'vue'
import {
  HoverHint,
  Icon,
  Inputs,
  Modals,
  Buttons as SpButton,
  Select as SpSelect,
  Toggles,
} from '@storipress/core-component'
import invariant from 'tiny-invariant'
import { useForm } from 'vee-validate'
import { object as yupObject } from 'yup'
import { P, isMatching } from 'ts-pattern'
import { useContentModelValidate } from '../utils'
import type { BasicCustomFieldInput, NewCustomField } from '../AddNewFieldModel/definition'
import { SelectInput, fields, referenceTarget } from '../AddNewFieldModel'
import type { CustomFieldInput } from './definition'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { CustomFieldType } from '~/graphql-operations'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  fieldData: {
    type: Object as PropType<BasicCustomFieldInput | null>,
    default: () => {},
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:newField', value: string): void
  (event: 'addNewField', value: NewCustomField): void
  (event: 'submit', value: BasicCustomFieldInput): void
}>()

const shouldPreventEditDetails = computed(() =>
  isMatching(
    P.union(
      // Webflow reference type
      { type: 'reference', target: 'webflow' },
      // Unsupported WordPress ACF reference type
      { type: 'reference', target: null },
    ),
    props.fieldData?.options,
  ),
)

const visible = useVModel(props, 'modelValue', emit)
const lockedFieldId = ref(true)
const customField = reactive<CustomFieldInput>({
  name: '',
  key: '',
  description: '',
  required: false,
  repeat: false,
  multiline: false,
  min: undefined,
  max: undefined,
  regex: '',
  multiple: false,
  target: '',
  choices: undefined,
})
const isNumber = computed(() => props.fieldData?.type === CustomFieldType.Number)

const min = computed({
  get() {
    const result = customField.min?.toString()
    return result
  },
  set(val) {
    customField.min = val ? Number(val) : undefined
  },
})
const max = computed({
  get() {
    const result = customField.max?.toString()
    return result
  },
  set(val) {
    customField.max = val ? Number(val) : undefined
  },
})

const { nameValidate, keyValidate, descriptionValidate, minValidate, maxValidate, targetValidate } =
  useContentModelValidate()
const schema = computed(() =>
  yupObject().shape({
    'field-name': nameValidate(),
    'field-key': keyValidate(),
    'field-description': descriptionValidate(),
    'field-min': minValidate(),
    'field-max': maxValidate(),
    'field-target': targetValidate(props.fieldData?.type),
  }),
)
const { handleSubmit, handleReset } = useForm({
  initialValues: {
    'field-name': '',
    'field-key': '',
    'field-description': '',
    'field-min': undefined,
    'field-max': undefined,
    'field-regex': '',
    'field-target': '',
  },
  validationSchema: schema,
})

watch(
  () => props.fieldData,
  (data) => {
    if (!data) return
    const { id, name, key, description, type } = data
    handleReset()
    Object.assign(customField, { id, name, key, description, type, ...data?.options })
  },
)

function initModal() {
  visible.value = false
  lockedFieldId.value = true
}
function filterOptions(option: string) {
  if (!props.fieldData?.options) return

  return Object.keys(props.fieldData?.options).find((item) => item === option)
}
const submit = handleSubmit(() => {
  const {
    id,
    key,
    name,
    description,
    multiline,
    min = null,
    max = null,
    regex,
    target,
    multiple,
    choices,
    ...options
  } = customField
  invariant(props.fieldData?.type, 'not find custom field type')
  emit('submit', {
    ...(id && { id }),
    key,
    name,
    description,
    type: props.fieldData.type,
    options: {
      type: props.fieldData.type,
      ...options,
      ...(filterOptions('multiline') && { multiline }),
      ...(filterOptions('min') && { min: min || null }),
      ...(filterOptions('max') && { max: max || null }),
      ...(filterOptions('regex') && { regex: regex || null }),
      ...(filterOptions('target') && { target }),
      ...(filterOptions('multiple') && { multiple }),
      ...(filterOptions('choices') && { choices }),
    },
  })
  initModal()
})

const [confirmUnLockFieldId] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Warning! Changing a published field ID',
    description: `Changing the ID of this field is immediate and will cause problems for any Publications currently using it until those Publications are updated.

Your content will not show correctly until you update the field ID in your applications.`,
    okText: 'Unlock field for editing',
    cancelText: 'Cancel',
  },
])
async function unLockFieldId() {
  if (!lockedFieldId.value) {
    lockedFieldId.value = true
    return
  }
  if (await confirmUnLockFieldId()) {
    lockedFieldId.value = false
  }
}
</script>

<template>
  <Modals :visible="visible" @on-modal-close="initModal()">
    <form class="layer-2 w-[40rem] rounded-lg bg-white" @submit.prevent>
      <div class="text-display-small flex items-center gap-x-4 border-b border-stone-200 p-5">
        <Icon
          :icon-name="fields.find((field) => field.type === fieldData?.type)?.icon ?? ''"
          class="flex size-10 items-center justify-center rounded border border-sky-700 bg-sky-700/20 text-2xl text-sky-700"
        />
        <div class="text-display-small flex gap-x-2">
          <span class="font-semibold text-stone-800">{{ fieldData?.name }}</span>
          <span class="text-stone-400">{{ fieldData?.type }}</span>
        </div>
      </div>
      <div class="flex h-[21.56rem]">
        <div class="flex h-full w-[17.5rem] flex-col gap-y-6 border-r border-stone-200 px-5 pt-7">
          <Inputs v-model="customField.name" label="Name (required)" html-type="text" html-name="field-name" />
          <div class="relative">
            <Inputs
              v-model="customField.key"
              label="Field ID (required)"
              html-type="text"
              html-name="field-key"
              :disabled="lockedFieldId"
            />
            <div
              role="button"
              class="absolute bottom-0 right-0 flex h-9 w-10 items-center justify-center rounded-l-md border-l border-gray-400"
              @click="unLockFieldId"
            >
              <Icon :icon-name="lockedFieldId ? 'lock-filled' : 'lock'" class="text-base text-stone-600" />
            </div>
          </div>
          <Inputs
            v-model="customField.description"
            label="Description"
            html-type="text"
            html-name="field-description"
          />
          <div v-if="filterOptions('repeat')" class="flex items-center justify-between">
            <div class="flex flex-col gap-y-[0.125rem]">
              <span class="text-body text-stone-800">Repeating</span>
              <span class="text-caption text-stone-500">Allow user to repeat fields</span>
            </div>
            <Toggles v-model="customField.repeat" type="simple" />
          </div>
        </div>
        <div class="flex flex-1 flex-col gap-y-6 px-5 pt-7">
          <HoverHint :disabled="!shouldPreventEditDetails">
            <SpSelect
              v-if="filterOptions('target')"
              v-model="customField.target"
              display-class="capitalize"
              :class="shouldPreventEditDetails && 'opacity-70'"
              :disabled="shouldPreventEditDetails"
              :items="referenceTarget"
              name="field-target"
              placeholder="Select from dropdown ..."
              label="Collection to reference from"
            />
            <template #content> Editing this setting is not supported for this field</template>
          </HoverHint>

          <div v-if="filterOptions('multiple')" class="flex items-center justify-between">
            <div class="flex flex-col gap-y-[0.125rem]">
              <span class="text-body text-stone-800">Multiple choice</span>
              <span class="text-caption text-stone-500">Choose multiple options from the dropdown</span>
            </div>
            <HoverHint :disabled="!shouldPreventEditDetails">
              <Toggles
                v-model="customField.multiple"
                :class="shouldPreventEditDetails && 'opacity-70'"
                :disabled="shouldPreventEditDetails"
                type="simple"
              />
              <template #content> Editing this setting is not supported for this field</template>
            </HoverHint>
          </div>

          <SelectInput v-if="filterOptions('choices')" v-model="customField.choices" />

          <div v-if="filterOptions('multiline')" class="flex items-center justify-between">
            <div class="flex flex-col gap-y-[0.125rem]">
              <span class="text-body text-stone-800">Multi-line text</span>
              <span class="text-caption text-stone-500">Support newline characters</span>
            </div>
            <Toggles v-model="customField.multiline" type="simple" />
          </div>
          <div class="flex gap-x-4">
            <Inputs
              v-if="filterOptions('min')"
              v-model="min"
              :label="isNumber ? 'Min Number' : 'Min Characters'"
              html-type="text"
              html-name="field-min"
            />
            <Inputs
              v-if="filterOptions('max')"
              v-model="max"
              :label="isNumber ? 'Max Number' : 'Max Characters'"
              html-type="text"
              html-name="field-max"
            />
          </div>
          <Inputs
            v-if="filterOptions('regex')"
            v-model="customField.regex"
            label="Regex match"
            html-type="text"
            html-name="field-regex"
          />
        </div>
      </div>

      <div class="flex justify-end border-t border-stone-200 px-5 py-4">
        <SpButton html-type="submit" color="primary" @click="submit">Update field</SpButton>
      </div>
    </form>
  </Modals>
</template>
