<script setup lang="ts">
import { Icon as SpIcon, Inputs as SpInput } from '@storipress/core-component'
import BooleanField from './BooleanField.vue'
import FileFiled from './FileFiled.vue'
import UrlField from './UrlField.vue'
import ColorField from './ColorField.vue'
import DateField from './DateField.vue'
import TextField from './TextField.vue'
import SelectField from './SelectField.vue'
import { ReferenceField } from './ReferenceField'
import type { CustomFieldMeta, CustomFieldOptions, FieldTypeMap, RepeatCustomFieldValue } from './definition'
import { CustomFieldType } from '~/graphql-operations'

const props = withDefaults(
  defineProps<{
    meta: CustomFieldMeta<CustomFieldOptions>[]
    editedValues: Map<string, CustomFieldMeta<CustomFieldOptions>>
    showLoading: boolean
  }>(),
  {
    showLoading: false,
  },
)
const emit = defineEmits<{
  (event: 'repeatValue', val: RepeatCustomFieldValue, index: number): void
  (event: 'deleteValue', value: CustomFieldMeta<CustomFieldOptions>, index: number): void
  (event: 'addDeleteFile', value: CustomFieldMeta<CustomFieldOptions>, id: string): void
}>()

const meta = toRef(props, 'meta')

function deleteValue(values: CustomFieldMeta<CustomFieldOptions>, index: number) {
  if (values?.id) {
    if (values.field.type === 'file') {
      const deleteFile = {
        ...values,
        id: undefined,
        value: null,
        validateKey: 'file-thumbnail-image-undefined',
      }
      meta.value[index] = deleteFile
    } else {
      meta.value.splice(index, 1)
    }
    props.editedValues.set(values.id, { type: 'delete', ...values })
  } else {
    meta.value.splice(index, 1)
  }
}

const fieldTypeMap: FieldTypeMap = {
  [CustomFieldType.Text]: TextField,
  [CustomFieldType.Number]: SpInput,
  [CustomFieldType.Color]: ColorField,
  [CustomFieldType.Url]: UrlField,
  [CustomFieldType.Boolean]: BooleanField,
  [CustomFieldType.File]: FileFiled,
  [CustomFieldType.Date]: DateField,
  [CustomFieldType.Json]: null,
  [CustomFieldType.RichText]: null,
  [CustomFieldType.Select]: SelectField,
  [CustomFieldType.Reference]: ReferenceField,
}
</script>

<template>
  <form class="flex flex-col gap-y-4" @submit.prevent>
    <div
      v-for="(values, idx) in props.meta"
      :key="values.validateKey"
      class="flex justify-between"
      :class="[
        values.repeat && props.meta.filter((item) => item.field.id === values.field.id).length > 1
          ? 'gap-x-[5rem]'
          : 'gap-x-1',
        values.field.type === 'boolean' ? 'h-[3.25rem] items-center' : 'items-end',
      ]"
    >
      <component
        :is="fieldTypeMap[values.field.type]"
        :model-value="values.value"
        v-bind="{
          label:
            values.repeat || values.isRepeating ? `${values.field.name} (repeating field)` : `${values.field.name}`,
          description: values.field.description,
          'html-name': values.validateKey,
          multiline: values.field.options?.multiline,
          time: values.field.options?.time,
          placeholder: values.field.options?.placeholder,
          choices: values.field.options?.choices,
          multiple: values.field.options?.multiple,
          target: values.field.options?.target,
          options: values.field.options,
          ...(values.field.type === 'file' && { 'is-loading': showLoading }),
        }"
        class="w-full"
        @update:model-value="
          ($event: any) => {
            values.value = $event
            values?.id && editedValues.set(values.id, { type: 'update', ...values })
          }
        "
      />
      <div v-if="values.repeat || values.isRepeating" class="flex gap-x-1">
        <div
          v-if="
            (props.meta.filter((item) => item.field.id === values.field.id).length > 1 && !values.repeat) ||
            props.meta.filter((item) => item.field.id === values.field.id).length === 1
          "
          role="button"
          class="flex size-9 cursor-pointer rounded-3xl p-2.5 duration-75 ease-in-out hover:bg-gray-200"
          @click="
            emit(
              'repeatValue',
              { value: null, group: values.group, field: { ...values.field }, isRepeating: true },
              idx + 1,
            )
          "
        >
          <SpIcon icon-name="plus" class="text-stone-500" />
        </div>
        <div
          v-if="values.isRepeating || (values.id && values.field.type === 'file')"
          role="button"
          class="flex size-9 cursor-pointer rounded-3xl p-2.5 duration-75 ease-in-out hover:bg-gray-200"
          @click="deleteValue(values, idx)"
        >
          <SpIcon icon-name="delete" class="text-stone-500" />
        </div>
      </div>
      <div
        v-else-if="values.id && values.field.type === 'file'"
        role="button"
        class="flex size-9 cursor-pointer rounded-3xl p-2.5 duration-75 ease-in-out hover:bg-gray-200"
        @click="deleteValue(values, idx)"
      >
        <SpIcon icon-name="delete" class="text-stone-500" />
      </div>
    </div>
  </form>
</template>

<style scoped></style>
