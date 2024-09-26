import { FieldType, storageCtx, useProvideFieldStorage, wrapFieldAsStorage } from '@storipress/custom-field'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toRef } from '@vueuse/core'

type CustomFieldType = 'text' | 'number' | 'color' | 'url' | 'boolean' | 'richText' | 'file' | 'date' | 'json'
export enum FieldTypeMap {
  boolean = 'Bool',
  color = 'Color',
  date = 'Date',
  file = 'File',
  json = 'Json',
  number = 'Number',
  richText = 'RichText',
  text = 'Text',
  url = 'URL',
}
interface MetaFieldValue {
  __typename: string
  id: string
  [value: string]: string | number | boolean | Date | unknown
}
interface MetaFields {
  id: string
  key: string
  type: CustomFieldType
  values: MetaFieldValue[]
  group: {
    id: string
    key: string
  }
}

function getCustomFields(metafields: MetaFields[]) {
  if (!metafields) {
    return {}
  }
  const result = Object.fromEntries(
    metafields.map((cur) => {
      const groupKey = cur.group.key
      const fieldKey = cur.key
      const type = FieldTypeMap[cur.type]
      const fieldType = FieldType[type]
      const concatType = `${groupKey}.${fieldKey}::${fieldType}`
      const fieldValues = cur.values.length ? cur.values.map((value) => getFieldValue(value)) : []
      return [concatType, fieldValues] as const
    }),
  )
  return result
}

const SWITCH_VALUE_MAP: Record<string, string> = {
  CustomFieldNumberValue: 'numberValue',
  CustomFieldBooleanValue: 'booleanValue',
  CustomFieldJsonValue: 'jsonValue',
  CustomFieldRichTextValue: 'jsonValue',
  CustomFieldFileValue: 'fileValue',
  CustomFieldDateValue: 'dateValue',
  CustomFieldSelectValue: 'selectValue',
}
function getFieldValue(value: MetaFieldValue) {
  const valueKey = SWITCH_VALUE_MAP[value.__typename]
  return valueKey ? value[valueKey] : value.value
}

export function useProvideCustomField(source: MaybeRefOrGetter<MetaFields[]>) {
  const fields = toRef(source)
  const storage = reactiveComputed(() => getCustomFields(fields.value))
  return useProvideRawCustomField(storage)
}

export function useProvideRawCustomField(storage: Record<string, unknown[]>) {
  storageCtx.set({ s: {}, a: {} }, true)
  useProvideFieldStorage(wrapFieldAsStorage(storage))
  return storage
}
