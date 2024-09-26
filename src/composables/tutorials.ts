import confetti from 'canvas-confetti'
import { useSiteStore } from '~/stores/site'
import { useMeStore } from '~/stores/me'
import { GetSiteCustomSiteDocument, UpdateSiteInfoDocument } from '~/graphql-operations'
import type { TutorialKeyType } from '~/components/Navbar/definition'
import { Flags } from '~/lib/feature-flag'

const SHOW_CONFETTI = new Set(['setPublicationDetail', 'setCreateDesks', 'setDomain', 'setSocialConnect'])

interface UserLike {
  avatar?: string | null
  first_name?: string | null
  last_name?: string | null
  location?: string | null
  bio?: string | null
}
interface UserInfoExcludeCheck {
  avatar?: boolean
  firstName?: boolean
  lastName?: boolean
  location?: boolean
  bio?: boolean
}

export function isAvatarSet(avatar: UserLike['avatar']) {
  return Boolean(avatar && new URL(avatar).host === 'assets.stori.press')
}
export function isUserInfoComplete(user: UserLike, excludeOptions?: UserInfoExcludeCheck): boolean {
  const { avatar = true, firstName = true, lastName = true, location = true, bio = false } = excludeOptions || {}

  return Boolean(
    (!avatar || isAvatarSet(user.avatar)) &&
      (!firstName || user.first_name) &&
      (!lastName || user.last_name) &&
      (!location || user.location) &&
      (!bio || user.bio),
  )
}

export function useTutorials() {
  const siteStore = useSiteStore()
  const meStore = useMeStore()
  const route = useRoute()

  const siteTutorials = computed(() => siteStore?.siteTutorials ?? {})

  const { mutate } = useMutation(UpdateSiteInfoDocument)

  const setTutorials = async (tutorialKey: TutorialKeyType | TutorialKeyType[]) => {
    const setTutorialList = Array.isArray(tutorialKey) ? tutorialKey : [tutorialKey]
    const taskNotCompleted = setTutorialList.filter((key) => !siteTutorials.value[key])

    if (taskNotCompleted.length) {
      const result = {
        ...siteTutorials.value,
      }
      for (const tutorialKey of setTutorialList) {
        if (!siteTutorials.value[tutorialKey]) {
          result[tutorialKey] = true
          SHOW_CONFETTI.has(tutorialKey) && showConfetti()
        }
      }
      await mutate({
        input: {
          tutorials: JSON.stringify(result),
        },
      })
      siteStore.fetchSiteTutorials()
    }
  }

  const incompleteUserInfo = computed<boolean>(() => {
    return meStore.me ? !isUserInfoComplete(meStore.me) : false
  })
  const incompleteAvatar = computed(() => {
    return meStore.me ? isUserInfoComplete(meStore.me, { avatar: false }) && !isAvatarSet(meStore.me?.avatar) : false
  })

  const { result: customSiteResult } = useFeatureFlaggedQuery(Flags.ShopifyIntegration, GetSiteCustomSiteDocument)
  const clickCustomiseTheme = () => {
    if (customSiteResult.value?.site.custom_site_template) {
      return
    }
    setTutorials('setCustomiseTheme')
    location.href = `/builder/${route.params.clientID}/front-page`
  }

  return {
    setTutorials,
    clickCustomiseTheme,
    incompleteUserInfo,
    incompleteAvatar,
  }
}

export function showConfetti() {
  confetti({
    particleCount: randomInRange(100, 150),
    angle: randomInRange(40, 60),
    spread: 70,
    origin: { x: 0 },
  })
  confetti({
    particleCount: randomInRange(100, 150),
    angle: randomInRange(120, 140),
    spread: 70,
    origin: { x: 1 },
  })
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}
