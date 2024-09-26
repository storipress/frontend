import { FieldType, FieldTypeMap } from './types'
import type { MetaFieldValue, MetaFields } from './types'
import { GetArticleMetafieldDocument } from '~/graphql-operations'
import { useProviderStore } from '~/stores/preview-provider'
import { Flags } from '~/lib/feature-flag'

export function useCustomField(id: string) {
  const { result: articleMetafieldResult } = useFeatureFlaggedQuery(Flags.CustomSite, GetArticleMetafieldDocument, {
    id,
  })
  const customField = ref()
  const store = useProviderStore()

  whenever(articleMetafieldResult, (result) => {
    customField.value = getCustomFields(result.article?.metafields ?? [])
    store.customFields = customField.value
  })

  return reactiveComputed(() => customField.value || {})
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
