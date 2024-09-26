import type { Component } from 'vue'
import type {
  CustomFieldGroup,
  CustomFieldReferenceTarget,
  CustomFieldType,
  CustomFieldValue,
  Maybe,
} from '~/graphql-operations'

type CustomFieldValueType = 'update' | 'delete'

interface BasicCustomFieldOptions {
  type: CustomFieldType
  required?: boolean | null
  repeat?: boolean | null
}

export interface CustomFieldOption {
  repeat?: boolean
  validateKey: string
  type?: CustomFieldValueType
  isRepeating?: boolean
}

export interface CustomFieldOptions extends BasicCustomFieldOptions {
  multiline?: boolean
  time?: boolean
  placeholder?: string
  choices?: JSON
  multiple?: boolean
  target?: CustomFieldReferenceTarget
}

export interface CustomField<Options> {
  description?: string | null
  id: string
  key: string
  group: Pick<CustomFieldGroup, 'key'>
  name: string
  type: CustomFieldType
  options?: Maybe<Options>
}

export interface CustomFieldMeta<T extends BasicCustomFieldOptions> extends CustomFieldOption {
  id?: string
  value: CustomFieldValue['value'] | null
  field: CustomField<T>
  group: Pick<CustomFieldGroup, 'key'>
}

export type FieldTypeMap = Record<CustomFieldType, Component | null>

export interface RepeatCustomFieldValue {
  value: null
  isRepeating: true
  field: CustomField<CustomFieldOptions>
  group: Pick<CustomFieldGroup, 'key'>
}
