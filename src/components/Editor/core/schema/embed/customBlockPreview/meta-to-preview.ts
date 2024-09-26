import type { Ref } from 'vue'
import { FieldType } from '@storipress/custom-field'
import type { CustomFieldMeta } from '~/components/CustomField/definition'
import { FieldTypeMap, useProvideRawCustomField } from '~/composables/custom-field-provider'
import type { CustomFieldOptions } from '~/composables/custom-field-editor'

export function useProvideCustomFieldFromMeta(meta: Ref<CustomFieldMeta<CustomFieldOptions>[]>) {
  const res = reactiveComputed(() => {
    const values: Record<string, unknown[]> = {}
    for (const item of meta.value) {
      const typeName = FieldTypeMap[item.field.type]
      const key = `${item.group.key}.${item.field.key}::${FieldType[typeName]}`
      const value = item.value
      values[key] ??= []
      values[key].push(value)
    }
    return values
  })
  return useProvideRawCustomField(res)
}
