import type { Ref } from 'vue'
import { useArticlePermission } from '~/composables/permission/article'
import type { ArticleLike } from '~/composables/permission/article'
import { useUserPermission } from '~/composables'
import { useFeatureFlagEvery } from '~/lib/feature-flag'

export function usePermission(article: Ref<ArticleLike>) {
  const userPermission = useUserPermission()
  const enable = useFeatureFlagEvery(['permission', 'editor-permission-check'])
  const { canEdit } = useArticlePermission()
  const permissionReady = computed(() => {
    return userPermission.value.ready
  })
  const checkEdit = computed(() => {
    return enable.value && permissionReady.value ? canEdit(article).value : true
  })

  return checkEdit
}
