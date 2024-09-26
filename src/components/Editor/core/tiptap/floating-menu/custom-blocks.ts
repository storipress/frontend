import { CustomFieldGroupType, CustomFieldGroupsDocument } from '~/graphql-operations'
import { Flags } from '~/lib/feature-flag'

export function useListCustomBlocks() {
  const { result: fieldsResult } = useFeatureFlaggedQuery(Flags.CustomSite, CustomFieldGroupsDocument)
  return computed(() => {
    return (
      fieldsResult.value?.customFieldGroups?.data.filter(
        (group) => group.type === CustomFieldGroupType.ArticleContentBlock,
      ) ?? []
    )
  })
}
