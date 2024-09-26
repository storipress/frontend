import type { MaybeRef } from '@vueuse/core'
import type { IdentifiableItem, UseUserPermissionInput } from './user-permission'
import { isAdmin, useUserPermission } from './user-permission'

export interface ArticleLike extends IdentifiableItem {
  authors: IdentifiableItem[]
  desk: IdentifiableItem
}

export function useArticlePermission(input?: UseUserPermissionInput) {
  const userPermission = useUserPermission(input)

  return {
    canEdit: (article: MaybeRef<ArticleLike>) => {
      return computed(() => {
        const { id, desk, authors } = unref(article)

        // If id doesn't loaded, don't check edit permission.
        // If this line removed will cause editor sometimes redirect to kanban, because this function always return false
        if (!id) return true

        if (!userPermission.value.ready) {
          return false
        }

        const { role, ownedDesks, userId, mainDeskMap } = userPermission.value
        // Admin can edit all articles
        if (isAdmin(role)) {
          return true
        }

        const mainDesk = mainDeskMap.get(desk.id) || desk.id

        // Editor can edit assigned desks
        if (role === 'editor') {
          if (ownedDesks.has(mainDesk)) {
            return true
          }
        }

        // Contributor only can edit assigned desks
        if (role === 'contributor') {
          if (!ownedDesks.has(mainDesk)) {
            return false
          }
        }

        // Editor/Author/Contributor can edit their own articles
        return authors.some(({ id }) => id === userId)
      })
    },
    canManage: (article: MaybeRef<ArticleLike>) => {
      return computed(() => {
        const { role, ownedDesks } = userPermission.value
        const { desk, authors } = unref(article)

        // Contributor can't manage anything
        if (role === 'contributor') {
          return false
        }

        // Admin can manage all articles
        if (isAdmin(role)) {
          return true
        }

        // Editor can manage assigned desks
        if (role === 'editor') {
          if (ownedDesks.has(desk.id)) {
            return true
          }
        }

        // Editor/Author can manage their own articles
        return authors.some(({ id }) => id === userPermission.value.userId)
      })
    },
  }
}
