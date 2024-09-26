import type { MaybeRef } from '@vueuse/core'
import type { Ref } from 'vue'
import type { MaybeIdentifiable, UseUserPermissionInput } from './user-permission'
import type { UseCurrentDeskInput } from '~/composables/desks'
import { useCurrentDesk } from '~/composables/desks'
import { isAdmin, useUserPermission } from './user-permission'

export interface UsePublicationPermissionReturn {
  ready: Ref<boolean>
  /** current user can update the desk meta, e.g. name */
  canUpdateDesk: (deskIdOrDesk: MaybeRef<MaybeIdentifiable>) => Ref<boolean>
  /** current user can watch the desk content */
  canAccessDesk: (deskIdOrDesk: MaybeRef<MaybeIdentifiable>) => Ref<boolean>
  /** current user can watch the desk content */
  canDragItemIntoDesk: (deskIdOrDesk: MaybeRef<MaybeIdentifiable>) => Ref<boolean>

  /** current user can invite other user */
  canInviteUser: Ref<boolean>
  /** current user can suspend or remove team members */
  canManageTeam: Ref<boolean>
  /** current user can update publication detail */
  canUpdatePublication: Ref<boolean>
  /** current user can access builder */
  canUseBuilder: Ref<boolean>
  /** current user can access integrations */
  canUseIntegrations: Ref<boolean>
  /** current user can update custom domain */
  canUseDomain: Ref<boolean>
  /** current user can update billing detail */
  canUseBilling: Ref<boolean>
  /** current user can add new desk */
  canAddDesk: Ref<boolean>
  /** current user can modify the desk-setting */
  canUpdateDeskSetting: Ref<boolean>
  /** current user can modify the desk-setting */
  canUpdateStage: Ref<boolean>
  /** current user can unpublish an article */
  canUnpublishedArticle: Ref<boolean>
  /** current user can publish an article */
  canPublishedArticle: Ref<boolean>
  /** current user can un-schedule an article */
  canUnscheduleArticle: Ref<boolean>
  /** current user can change articles stage */
  canChangeArticleStage: Ref<boolean>
  /** current user can delete a desk */
  canDeleteDesk: Ref<boolean>
  /** current user can update the basic info on the setting page */
  canUpdateSettingBasicInfo: Ref<boolean>
  /** current user can update the contact and social info on the setting page */
  canUpdateSettingContactAndSocialInfo: Ref<boolean>
  /** current user can update the danger zone on the setting page */
  canUpdateSettingDangerZone: Ref<boolean>
  /** current user can update the content on the team page of the setting */
  canUpdateSettingTeam: Ref<boolean>
  /** current user can access the integrations page */
  canAccessIntegrations: Ref<boolean>
  /** current user can access the domain page */
  canAccessDomains: Ref<boolean>
  /** current user can access the builder */
  canAccessBuilder: Ref<boolean>
  /** current user can access the member page */
  canAccessMember: Ref<boolean>
  /** current user can do the Tutorial */
  canAccessTutorial: Ref<boolean>
  /** current user can manage Subscribers */
  canManageSubscribers: Ref<boolean>
  /** current user can setup the Member */
  canSetupMember: Ref<boolean>
  /** current user can setting the Custom Site and get API key */
  canHostingCustomSite: Ref<boolean>
  /** current user can get Newstand API key */
  canGetApiKay: Ref<boolean>
  /** current user can Setting Content Model */
  canSettingContentModel: Ref<boolean>
  /** current user can access the onboarding page */
  canAccessOnboarding: Ref<boolean>
}

export function usePublicationPermission(
  userInput?: UseUserPermissionInput,
  useCurrentDeskInput?: UseCurrentDeskInput,
  initialCurrentDesk?: string,
): UsePublicationPermissionReturn {
  const userPermission = useUserPermission(userInput)
  const { currentDesk, currentMainDesk, mapIdToMainDesk } = useCurrentDesk(useCurrentDeskInput, initialCurrentDesk)

  const userIsEditor = computed(() => {
    const { role, ready } = userPermission.value
    if (!ready) {
      return false
    }

    return role === 'editor' || isAdmin(role)
  })

  const userIsAdmin = computed(() => {
    const { role, ready } = userPermission.value

    if (!ready) {
      return false
    }

    return isAdmin(role)
  })

  const userIsOwner = computed(() => {
    const { role, ready } = userPermission.value
    return ready && role === 'owner'
  })

  const checkIsAdminOrIsJoinedDesk = (deskIdOrDesk: MaybeRef<MaybeIdentifiable>) => {
    return computed(() => {
      const d = unref(deskIdOrDesk)
      const id = typeof d === 'string' ? d : d.id

      const { role, ownedDesks, mainDeskMap, ready } = userPermission.value

      if (!ready) {
        return false
      }

      if (isAdmin(role)) {
        return true
      }
      const mainDesk = mapIdToMainDesk.value.get(id)
      return mainDesk?.open_access || ownedDesks.has(mainDeskMap.get(id) ?? '')
    })
  }

  const isManager = computed(() => {
    const { role, ownedDesks, ready } = userPermission.value
    if (!ready) {
      return false
    }
    if (role === 'editor') {
      return currentMainDesk.value?.open_access || ownedDesks.has(currentDesk.value?.id ?? '')
    }

    return role !== 'author' && role !== 'contributor'
  })
  const isNotContributor = computed(() => {
    const { role, ready } = userPermission.value
    if (!ready) {
      return false
    }

    return role !== 'contributor'
  })

  return {
    ready: computed(() => userPermission.value.ready),
    canInviteUser: userIsEditor,
    canManageTeam: userIsAdmin,
    canUpdatePublication: userIsAdmin,
    canUseBuilder: userIsAdmin,
    canUseIntegrations: userIsAdmin,
    canUseDomain: userIsAdmin,
    canUseBilling: userIsOwner,
    canUpdateDesk: (deskIdOrDesk: MaybeRef<MaybeIdentifiable>) => {
      return computed(() => {
        const d = unref(deskIdOrDesk)
        const id = typeof d === 'string' ? d : d.id

        const { role, ownedDesks, mainDeskMap, ready } = userPermission.value

        if (!ready) {
          return false
        }

        if (isAdmin(role)) {
          return true
        }

        if (role === 'editor') {
          const mainDesk = mapIdToMainDesk.value.get(id)
          return mainDesk?.open_access || ownedDesks.has(mainDeskMap.get(id) ?? '')
        }

        return false
      })
    },
    canAddDesk: userIsAdmin,
    canAccessDesk: checkIsAdminOrIsJoinedDesk,
    canUpdateDeskSetting: userIsAdmin,
    canUpdateStage: userIsAdmin,
    canDragItemIntoDesk: checkIsAdminOrIsJoinedDesk,
    canUnpublishedArticle: isNotContributor,
    canPublishedArticle: isNotContributor,
    canUnscheduleArticle: isNotContributor,
    canChangeArticleStage: isNotContributor,
    canDeleteDesk: userIsAdmin,
    canUpdateSettingBasicInfo: userIsAdmin,
    canUpdateSettingContactAndSocialInfo: userIsAdmin,
    canUpdateSettingDangerZone: userIsOwner,
    canUpdateSettingTeam: userIsAdmin,
    canAccessIntegrations: userIsAdmin,
    canAccessDomains: userIsAdmin,
    canAccessBuilder: userIsAdmin,
    canAccessTutorial: userIsAdmin,
    canAccessMember: userIsAdmin,
    canManageSubscribers: userIsAdmin,
    canSetupMember: userIsOwner,
    canHostingCustomSite: userIsOwner,
    canGetApiKay: userIsAdmin,
    canSettingContentModel: userIsEditor,
    canAccessOnboarding: userIsOwner,
  }
}
