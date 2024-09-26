import invariant from 'tiny-invariant'
import type { Ref } from 'vue'
import { useCRDTMap } from '~/composables'
import type { CustomFields, FieldValues } from '~/composables/custom-field-editor'
import { CustomFieldGroupsDocument, GetArticleContentBlockDocument } from '~/graphql-operations'
import { Flags } from '~/lib/feature-flag'

interface UseContentBlockReturn {
  fields: Ref<CustomFields[]>
  version: Ref<string>
  values: Ref<FieldValues>
  blocksMapField: Ref<{ id: string }>
  blocksMap: Ref<{ id: string | null; value: Record<string, string[]> }>
  hasBlockMap: Ref<boolean>
  fieldIds: Ref<string[]> & { getMap: () => Record<string, string[]> }
  refetch: () => Promise<void>
}

export function useContentBlock(blockName: string, uuid: string, articleID: string): UseContentBlockReturn {
  const { result: fieldsResult } = useFeatureFlaggedQuery(Flags.CustomSite, CustomFieldGroupsDocument)
  const { result: valuesResult, refetch } = useFeatureFlaggedQuery(Flags.CustomSite, GetArticleContentBlockDocument, {
    id: articleID,
  })
  const fields: Ref<CustomFields[]> = computed((): CustomFields[] => {
    return fieldsResult.value?.customFieldGroups?.data.find((group) => group.key === blockName)?.fields ?? []
  })
  const values: Ref<FieldValues> = computed((): FieldValues => {
    return valuesResult.value?.article?.content_blocks.filter(({ group }) => group.key === blockName) || []
  })

  const blocksMapField = computed(() => {
    const field = values.value.find(({ key }) => key === '__blocks')
    invariant(field, 'no __blocks field')
    return field
  })
  const maybeBlocksMap = computed(() => {
    return blocksMapField.value.values[0]
  })
  const blocksMap = computed(() => {
    const value = maybeBlocksMap.value ?? {
      __typename: 'CustomFieldJsonValue',
      id: null,
      jsonValue: '{}',
    }
    invariant(value.__typename === 'CustomFieldJsonValue')
    const res = {
      id: value.id,
      value: JSON.parse(value.jsonValue || '{}'),
    }
    invariant(typeof res.value === 'object')
    return res
  })
  const fieldIds = useCRDTMap<string[]>({
    fieldName: `custom-block:${blockName}`,
    key: uuid,
  })
  const version = useCRDTMap<string>({
    fieldName: `custom-block:${blockName}-version`,
    key: uuid,
  })

  watch(
    version,
    () => {
      refetch()
    },
    { deep: true },
  )

  return {
    fields,
    version,
    async refetch() {
      await refetch()
    },
    values: computed(() => {
      const ids = new Set(fieldIds.value)
      return values.value.map((field) => {
        // ensure value is in the `ids` set
        return { ...field, values: field.values.filter((value) => ids.has(value.id)) }
      })
    }),
    blocksMapField,
    blocksMap,
    hasBlockMap: computed(() => Boolean(maybeBlocksMap.value)),
    fieldIds,
  }
}
