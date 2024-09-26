<script setup lang="ts">
import type { PropType } from 'vue'
import { Icon, Inputs, Modals, Buttons as SpButton, Select as SpSelect, Toggles } from '@storipress/core-component'
import invariant from 'tiny-invariant'
import { useForm } from 'vee-validate'
import { object as yupObject } from 'yup'
import { useContentModelValidate } from '../utils'
import { fields, referenceTarget } from './definition'
import type { BasicCustomFieldInput, NewCustomField } from './definition'
import { SelectInput } from '.'
import { CustomFieldType } from '~/graphql-operations'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  newField: {
    type: Object as PropType<NewCustomField | null>,
    default: () => {},
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:newField', value: string): void
  (event: 'addNewField', value: NewCustomField): void
  (event: 'submit', value: BasicCustomFieldInput): void
}>()

const { nameValidate, keyValidate, descriptionValidate, minValidate, maxValidate, targetValidate } =
  useContentModelValidate()
const schema = computed(() =>
  yupObject().shape({
    'new-field-name': nameValidate(),
    'new-field-key': keyValidate(),
    'new-field-description': descriptionValidate(),
    'new-field-min': minValidate(),
    'new-field-max': maxValidate(),
    'new-field-target': targetValidate(props.newField?.type),
  }),
)
const { handleSubmit, handleReset, setFieldError } = useForm({
  initialValues: {
    'new-field-name': '',
    'new-field-key': '',
    'new-field-description': '',
    'new-field-min': undefined,
    'new-field-max': undefined,
    'new-field-regex': '',
    'new-field-target': '',
  },
  validationSchema: schema,
})
const visible = useVModel(props, 'modelValue', emit)
const newField = useVModel(props, 'newField', emit)
const defaultCustomField = {
  name: '',
  key: '',
  description: '',
  required: false,
  repeat: false,
  multiline: false,
  min: undefined,
  max: undefined,
  regex: undefined,
  float: false,
  time: false,
  multiple: false,
  target: '',
  choices: undefined,
}
const newCustomField = reactive({ ...defaultCustomField })
const focusInput = ref(false)
const editedKey = ref(false)
const isNumber = computed(() => props.newField?.type === CustomFieldType.Number)

whenever(visible, () => {
  Object.assign(newCustomField, defaultCustomField)
})

// mark field as valid when to initialize a form that exist in a modal
whenever(visible, () => {
  setFieldError('new-field-name', undefined)
  setFieldError('new-field-key', undefined)
})

watch(
  () => newCustomField.key,
  (key) => {
    if (focusInput.value && Boolean(key)) {
      editedKey.value = true
    }
  },
)
watch(
  () => newCustomField.name,
  (name) => {
    if (!editedKey.value) {
      const result = name.replaceAll(' ', '_').toLowerCase()
      newCustomField.key = result
    }
  },
)

function initModal() {
  visible.value = false
  editedKey.value = false
  newField.value = null
  handleReset()
}
function filterOptions(option: string) {
  return props.newField?.options.find((item) => item === option)
}
const submit = handleSubmit(() => {
  const {
    key,
    name,
    description,
    multiline,
    min,
    max,
    regex,
    float,
    time,
    repeat,
    target,
    multiple,
    choices,
    ...options
  } = newCustomField
  invariant(props.newField?.type, 'not find custom field type')
  emit('submit', {
    key,
    name,
    type: props.newField.type,
    description,
    options: {
      type: props.newField.type,
      ...options,
      ...(filterOptions('multiline') && { multiline }),
      ...(filterOptions('min') && { min: min || null }),
      ...(filterOptions('max') && { max: max || null }),
      ...(filterOptions('regex') && { regex: regex || null }),
      ...(filterOptions('float') && { float }),
      ...(filterOptions('time') && { time }),
      ...(filterOptions('repeat') && { repeat }),
      ...(filterOptions('target') && { target }),
      ...(filterOptions('multiple') && { multiple }),
      ...(filterOptions('choices') && { choices }),
    },
  })
  initModal()
})
</script>

<template>
  <Modals :visible="visible" @on-modal-close="initModal()">
    <div class="layer-2 w-[40rem] rounded-lg bg-white">
      <template v-if="newField">
        <form @submit.prevent>
          <div class="text-display-small flex items-center gap-x-4 border-b border-stone-200 p-5">
            <Icon
              :icon-name="fields.find((field) => field.type === newField?.type)?.icon ?? ''"
              class="flex size-10 items-center justify-center rounded border border-sky-700 bg-sky-700/20 text-2xl text-sky-700"
            />
            <div class="flex gap-x-2">
              <span class="font-semibold text-stone-800">New Field</span>
              <span class="text-stone-400">{{ newField.name }}</span>
            </div>
          </div>

          <div class="flex h-[21.56rem]">
            <div class="flex h-full w-[17.5rem] flex-col gap-y-6 border-r border-stone-200 px-5 pt-7">
              <Inputs
                v-model="newCustomField.name"
                label="Name (required)"
                html-type="text"
                html-name="new-field-name"
              />
              <Inputs
                v-model="newCustomField.key"
                label="Field ID (required)"
                html-type="text"
                html-name="new-field-key"
                @focus="focusInput = true"
                @blur="focusInput = false"
              />
              <Inputs
                v-model="newCustomField.description"
                label="Description"
                html-type="text"
                html-name="new-field-description"
              />
              <div v-if="filterOptions('repeat')" class="flex items-center justify-between">
                <div class="flex flex-col gap-y-[0.125rem]">
                  <span class="text-body text-stone-800">Repeating</span>
                  <span class="text-caption text-stone-500">Allow user to repeat fields</span>
                </div>
                <Toggles v-model="newCustomField.repeat" type="simple" />
              </div>
            </div>
            <div class="flex flex-1 flex-col gap-y-6 px-5 pt-7">
              <SpSelect
                v-if="filterOptions('target')"
                v-model="newCustomField.target"
                display-class="capitalize"
                :items="referenceTarget"
                name="new-field-target"
                placeholder="Select from dropdown ..."
                label="Collection to reference from"
              />

              <div v-if="filterOptions('multiple')" class="flex items-center justify-between">
                <div class="flex flex-col gap-y-[0.125rem]">
                  <span class="text-body text-stone-800">Multiple choice</span>
                  <span class="text-caption text-stone-500">Choose multiple options from the dropdown</span>
                </div>
                <Toggles v-model="newCustomField.multiple" type="simple" />
              </div>

              <SelectInput v-if="filterOptions('choices')" v-model="newCustomField.choices" />

              <div v-if="filterOptions('multiline')" class="flex items-center justify-between">
                <div class="flex flex-col gap-y-[0.125rem]">
                  <span class="text-body text-stone-800">Multi-line text</span>
                  <span class="text-caption text-stone-500">Support newline characters</span>
                </div>
                <Toggles v-model="newCustomField.multiline" type="simple" />
              </div>
              <div class="flex gap-x-4">
                <Inputs
                  v-if="filterOptions('min')"
                  v-model="newCustomField.min"
                  :label="isNumber ? 'Min Number' : 'Min Characters'"
                  html-type="text"
                  html-name="new-field-min"
                />
                <Inputs
                  v-if="filterOptions('max')"
                  v-model="newCustomField.max"
                  :label="isNumber ? 'Max Number' : 'Max Characters'"
                  html-type="text"
                  html-name="new-field-max"
                />
              </div>
              <Inputs
                v-if="filterOptions('regex')"
                v-model="newCustomField.regex"
                label="Regex match"
                html-type="text"
                html-name="new-field-regex"
              />
            </div>
          </div>

          <div class="flex justify-end border-t border-stone-200 px-5 py-4">
            <SpButton html-type="submit" color="primary" @click="submit">Create field</SpButton>
          </div>
        </form>
      </template>

      <template v-else>
        <div class="text-display-small flex justify-between border-b border-stone-200 p-5 text-stone-800">
          Add new field
        </div>

        <div class="grid grid-cols-3 gap-4 p-5">
          <div
            v-for="(field, index) in fields"
            :key="index"
            class="layer-1 flex gap-x-[1.188rem] rounded-lg p-4 transition-shadow hover:layer-2"
            role="button"
            @click="emit('addNewField', field)"
          >
            <Icon :icon-name="field.icon" class="text-[2.5rem] text-stone-600" />
            <div class="flex flex-col gap-y-[0.125rem]">
              <span class="text-heading text-stone-800">{{ field.name }}</span>
              <span class="text-caption text-stone-800">{{ field.info }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </Modals>
</template>
