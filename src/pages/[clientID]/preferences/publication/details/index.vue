<script lang="ts" setup>
import { NavbarSave } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import { array as yupArray, object as yupObject, string as yupString } from 'yup'
import type { LanguageItem, NewSocialInfo, PublicationInfo, Timezone } from './components/definitions'
import { SocialNetworkList, languageList } from './components/definitions'
import BasicInformation from './components/BasicInformation.vue'
import SocialInformation from './components/SocialInformation.vue'
import DangerZone from './components/DangerZone.vue'
import timezones from './timezones'
import { useWorkspaceStore } from '~/stores/workspace'
import { useSiteStore } from '~/stores/site'
import type { GetSiteQuery } from '~/graphql-operations'
import { UpdateSiteInfoDocument } from '~/graphql-operations'
import { dayjs } from '~/lib/dayjs'
import { useTutorials } from '~/composables'

const { setTutorials } = useTutorials()

const workspaceStore = useWorkspaceStore()
const siteStore = useSiteStore()
const site = computed(() => siteStore.site ?? ({} as GetSiteQuery['site']))

useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Publication details - Storipress`),
})

sendTrackUnchecked('publication_settings_view')

const { onDone: onDoneUpdateSiteInfo, mutate: mutateUpdateSiteInfo } = useMutation(UpdateSiteInfoDocument)

const defaultLanguage = computed(
  () =>
    languageList.find(({ key }) => key === site.value?.lang) ??
    (languageList.find(({ key }) => key === 'en') as LanguageItem),
)

const publicationInfo = reactive<PublicationInfo>({
  favicon: '',
  name: '',
  language: {} as LanguageItem,
  timezone: {} as Timezone,
  email: '',
  socials: [],
  homepageUrl: '',
})
const newSocialList = ref<NewSocialInfo[]>([])

const timezoneText = computed(() => {
  const result = timezones.find((timezone) => timezone.value === site.value.timezone)
  if (!site.value.timezone) {
    return { text: '', value: '', utc: '' }
  }
  if (result) {
    return result
  } else {
    const userTimezone = site.value.timezone?.split('/')[1].replaceAll('_', ' ')
    const result = timezones.find((timezone) => timezone.text.includes(userTimezone))
    if (result) {
      return result
    } else {
      const userTimezoneUtc = dayjs().tz(site.value.timezone).format('Z')
      return timezones.find((timezone) => timezone.utc === userTimezoneUtc)
    }
  }
})

const isChanged = ref(false)
const { ignoreUpdates } = ignorableWatch([publicationInfo, newSocialList], () => (isChanged.value = true), {
  deep: true,
  flush: 'post',
})
whenever(
  () => site.value?.lang,
  () => {
    ignoreUpdates(() => {
      publicationInfo.language = languageList.find(({ key }) => key === site.value?.lang) ?? defaultLanguage.value
    })
  },
)
function reset() {
  const socialsObject = site.value.socials ? JSON.parse(site.value.socials) : {}
  const socialsResult = Object.entries(socialsObject).flatMap(([type, url]) => {
    if (type === SocialNetworkList.Homepage) {
      return []
    }
    return { type, url }
  })

  ignoreUpdates(() => {
    Object.assign(publicationInfo, site.value)
    Object.assign(publicationInfo, { timezone: timezoneText.value })
    Object.assign(publicationInfo, { socials: socialsResult })
    Object.assign(publicationInfo, { homepageUrl: socialsObject?.__homepage ?? '' })
    Object.assign(publicationInfo, { language: defaultLanguage.value })
    newSocialList.value = []
  })
}

onMounted(async () => {
  reset()
})
watch(site, () => {
  reset()
})

onDoneUpdateSiteInfo(({ data }) => {
  if (data) isChanged.value = false
  if (data?.updateSiteInfo.favicon) {
    setTutorials('setPublicationDetail')
  }
  siteStore.fetchSite()
})

const schema = yupObject().shape({
  publicationName: yupString().required().label('This'),
  publicationEmail: yupString().email().nullable().label('This'),
  publicationSocialLinks: yupArray().of(
    yupString()
      .default('')
      .required()
      .label('Social link')
      .test('invalid', 'Add your URL without the https:// prefix', (value) => /^(?!http|https).*/.test(value)),
  ),
  publicationNewSocialLinks: yupArray().of(
    yupString()
      .default('')
      .required()
      .label('Social link')
      .test('invalid', 'Add your URL without the https:// prefix', (value) => /^(?!http|https).*/.test(value)),
  ),
  publicationNewSocialLinksType: yupArray().of(yupString().required().label('This')),
  homepageUrl: yupString().url().nullable().label('This'),
})
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})
const onSave = handleSubmit(async () => {
  const { name, timezone, email, socials, language, homepageUrl } = publicationInfo
  const mergeSocials = [...socials, ...newSocialList.value]
  const result = mergeSocials.reduce((acc, cur) => {
    return Object.assign(acc, { [cur.type!]: cur.url })
  }, {})
  if (homepageUrl) {
    Object.assign(result, { __homepage: homepageUrl })
  }
  await mutateUpdateSiteInfo({
    input: {
      name,
      timezone: timezone.value,
      email,
      socials: JSON.stringify(result),
      lang: language.key,
    },
  })
})
async function onDiscard() {
  reset()
  isChanged.value = false
}
async function updateLogomark(favicon: GetSiteQuery['site']['favicon']) {
  if (favicon) {
    ignoreUpdates(() => {
      publicationInfo.favicon = favicon
    })
  }
  await mutateUpdateSiteInfo({ input: { favicon } })
}
</script>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out origin-top"
    enter-from-class="transform scale-y-95 opacity-0"
    enter-to-class="transform scale-y-100 opacity-100"
    leave-active-class="transition duration-75 ease-in origin-top"
    leave-from-class="transform scale-y-100 opacity-100"
    leave-to-class="transform scale-y-95 opacity-0"
  >
    <NavbarSave class="fixed left-0" :show="isChanged" @on-discard="onDiscard" @on-save="onSave" />
  </transition>
  <Section title="Publication details" class="w-full">
    <!-- Basic information -->
    <BasicInformation :publication-info="publicationInfo" :errors="errors" @update-logomark="updateLogomark" />
    <!-- Contact and social information -->
    <SocialInformation :publication-info="publicationInfo" :new-social-list="newSocialList" :errors="errors" />
    <!-- Danger Zone -->
    <DangerZone :publication-info="publicationInfo" :errors="errors" />
  </Section>
</template>

<style></style>
