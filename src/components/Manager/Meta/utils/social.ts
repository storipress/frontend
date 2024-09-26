import { DEFAULT_ENABLE } from '../components/utils'
import type { FBData, IntegrationsData, TWData } from './types'
import type { IDefineYdocMapReturn } from './ydoc'
import type { MediaEnableSetting, MediaUserSettingCard } from '.'
import { SocialMedia, mediaSetting } from '.'
import { initUser } from '~/pages/[clientID]/articles/[id]/edit/utils'
import type { LinkedInAuthors, LinkedInConfiguration, ListIntegrationsQuery } from '~/graphql-operations'
import type { FormModel } from '~/pages/[clientID]/articles/[id]/edit/types'

function parseTargetUser(targetUser: IntegrationsData | LinkedInAuthors | undefined) {
  return { id: targetUser?.id ?? '', name: targetUser?.name ?? '', thumbnail: targetUser?.thumbnail ?? '' }
}

export function useSocial(
  integrations: Ref<ListIntegrationsQuery['integrations']>,
  formModel: FormModel,
  ydocEnable: IDefineYdocMapReturn<MediaEnableSetting>,
  ydocUser: IDefineYdocMapReturn<MediaUserSettingCard>,
  emit: (
    event: 'updateAutoPosting' | 'changeArticleSetUpdated',
    value?: string | boolean,
    column?: string,
    ignoreUpdate?: boolean,
  ) => void,
) {
  const { TWuser: initTWuser, FBuser: initFBuser, LNuser: initLNuser } = initUser()
  const twitter = computed(() => integrations?.value.find((item) => item.key === 'twitter'))
  const twitterActivated = computed(() => Boolean(twitter.value?.activated_at))
  const twitterList: ComputedRef<IntegrationsData[] | []> = computed(() => {
    return (
      (JSON.parse(twitter.value?.data || 'null')?.map((item: TWData) => ({
        ...item,
        id: item.user_id,
      })) as IntegrationsData[]) || []
    )
  })

  const facebook = computed(() => integrations?.value.find((item) => item.key === 'facebook'))
  const facebookActivated = computed(() => Boolean(facebook.value?.activated_at))
  const facebookList: ComputedRef<IntegrationsData[] | []> = computed(() => {
    return (
      (JSON.parse(facebook.value?.data || 'null')?.map((item: FBData) => ({
        ...item,
        id: item.page_id,
      })) as IntegrationsData[]) || []
    )
  })

  const linkedin = computed(() => integrations?.value.find((item) => item.key === 'linkedin'))
  const linkedinActivated = computed(() => Boolean(linkedin.value?.activated_at))
  const linkedinList: ComputedRef<LinkedInAuthors[] | []> = computed(
    () => (linkedin.value?.configuration as LinkedInConfiguration)?.authors || [],
  )

  function targetUserNotFound(mediaName: SocialMedia, defaultUserId: string) {
    const changedEnable = {
      ...(ydocEnable.get() || DEFAULT_ENABLE),
      [mediaName]: false,
    }
    ydocEnable.set(changedEnable)
    emit('changeArticleSetUpdated', false, mediaSetting[mediaName].toggle, true)
    emit('changeArticleSetUpdated', defaultUserId, mediaSetting[mediaName].id, true)
    emit('updateAutoPosting')
  }

  watch(linkedinList, () => {
    const targetUser = linkedinList.value.find((item) => item?.id === formModel.LNAuthorId)
    const userData = ydocUser.get()

    if (!initLNuser.value.id) {
      return
    }

    if (!targetUser) {
      targetUserNotFound(SocialMedia.linkedin, initLNuser.value.id)
    }

    ydocUser.set({
      Facebook: parseTargetUser(userData?.Facebook),
      Twitter: parseTargetUser(userData?.Twitter),
      LinkedIn: parseTargetUser(targetUser ?? initLNuser.value),
    } satisfies MediaUserSettingCard)
  })

  watch(facebookList, () => {
    const targetUser = facebookList.value.find((item) => item?.id === formModel.FBPageId)
    const userData = ydocUser.get()

    if (!initFBuser.value.id) {
      return
    }

    if (!targetUser) {
      targetUserNotFound(SocialMedia.facebook, initFBuser.value.id)
    }

    ydocUser.set({
      Facebook: parseTargetUser(targetUser ?? initFBuser.value),
      Twitter: parseTargetUser(userData?.Twitter),
      LinkedIn: parseTargetUser(userData?.LinkedIn),
    } satisfies MediaUserSettingCard)
  })

  watch(twitterList, () => {
    const targetUser = twitterList.value.find((item: IntegrationsData) => item?.id === formModel.TWUserId)
    const userData = ydocUser.get()

    if (!initTWuser.value.id) {
      return
    }

    if (!targetUser) {
      targetUserNotFound(SocialMedia.twitter, initTWuser.value.id)
    }

    ydocUser.set({
      Facebook: parseTargetUser(userData?.Facebook),
      Twitter: parseTargetUser(targetUser ?? initTWuser.value),
      LinkedIn: parseTargetUser(userData?.LinkedIn),
    } satisfies MediaUserSettingCard)
  })

  return {
    twitterActivated,
    twitterList,
    facebookActivated,
    facebookList,
    linkedinActivated,
    linkedinList,
  }
}
