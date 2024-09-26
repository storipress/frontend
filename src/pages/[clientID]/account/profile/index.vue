<script lang="ts" setup>
import { NavbarSave } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import { array as yupArray, object as yupObject, string as yupString } from 'yup'
import Details from './components/Details.vue'
import SocialInformation from './components/SocialInformation.vue'
import DangerZone from './components/DangerZone.vue'
import type { NewSocialInfo, ProfileWalkthroughField, UserInfo } from './definitions'
import type { GetMeAccountQuery } from '~/graphql-operations'
import { GetMeAccountDocument, UpdateProfileDocument } from '~/graphql-operations'
import { showConfetti } from '~/composables'
import { wrapInParagraph } from '~/components/Editor/rich-input/create-editor'

useHead({
  title: 'Storipress account profile',
})

const { result } = useQuery(GetMeAccountDocument)
const me = computed(() => result.value?.me)

const userInfo = reactive<UserInfo>({
  first_name: '',
  last_name: '',
  location: '',
  job_title: '',
  contact_email: '',
  bio: '',
  website: '',
  avatar: '',
  socials: [],
})
const newSocialList = ref<NewSocialInfo[]>([])

const isChanged = ref(false)
const { ignoreUpdates } = ignorableWatch([userInfo, newSocialList], () => (isChanged.value = true), {
  deep: true,
})
function reset() {
  const socialsObject = me.value?.socials ? JSON.parse(me.value.socials) : {}
  const socialsResult = Object.entries(socialsObject).map(([type, url]) => {
    return { type, url }
  })
  ignoreUpdates(() => {
    Object.assign(userInfo, {
      ...me.value,
      bio: me.value?.bio?.startsWith('<p>') ? me.value?.bio : wrapInParagraph(me.value?.bio ?? '').outerHTML,
    })
    Object.assign(userInfo, { first_name: me.value?.first_name ?? '' })
    Object.assign(userInfo, { last_name: me.value?.last_name ?? '' })
    Object.assign(userInfo, { socials: socialsResult })
    newSocialList.value = []
  })
}
const PROFILE_WALKTHROUGH_FIELD: ProfileWalkthroughField = ['first_name', 'last_name', 'bio', 'location']
function setProfileWalkthrough(newData: GetMeAccountQuery['me'], preData: GetMeAccountQuery['me']) {
  for (const field of PROFILE_WALKTHROUGH_FIELD) {
    if (!preData[field] && newData[field]) {
      showConfetti()
      return
    }
  }
}

watch(me, (newVal, preVal) => {
  if (preVal && newVal) setProfileWalkthrough(newVal, preVal)
  reset()
})

const { onDone: onDoneUpdateProfile, mutate: mutateUpdateProfile } = useMutation(UpdateProfileDocument)

onDoneUpdateProfile(({ data }) => {
  if (data) {
    isChanged.value = false
  }
})

const schema = yupObject().shape({
  firstName: yupString().required().label('This'),
  lastName: yupString().required().label('This'),
  publicEmail: yupString().email().nullable().label('This'),
  userSocialLinks: yupArray().of(
    yupString()
      .default('')
      .required()
      .label('Social link')
      .test('invalid', 'Add your URL without the https:// prefix', (value) => /^(?!http|https).*/.test(value)),
  ),
  userNewSocialLinks: yupArray().of(
    yupString()
      .default('')
      .required()
      .label('Social link')
      .test('invalid', 'Add your URL without the https:// prefix', (value) => /^(?!http|https).*/.test(value)),
  ),
  userNewSocialLinksType: yupArray().of(yupString().required().label('This')),
})
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})
const onSave = handleSubmit(async () => {
  const { first_name, last_name, job_title, contact_email, location, bio, website, socials } = userInfo
  const mergeSocials = [...socials, ...newSocialList.value]
  const result = Object.fromEntries(mergeSocials.map((social) => [social.type!, social.url]))

  await mutateUpdateProfile({
    input: {
      first_name,
      last_name,
      job_title,
      contact_email,
      location,
      bio,
      website,
      socials: JSON.stringify(result),
    },
  })
})
async function onDiscard() {
  reset()
  isChanged.value = false
}

async function updateAvatar(avatar: GetMeAccountQuery['me']['avatar']) {
  if (avatar) {
    ignoreUpdates(() => {
      userInfo.avatar = avatar
    })
  }
  await mutateUpdateProfile({ input: { avatar } })
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
  <Section v-bind="$attrs" title="My profile" class="w-full">
    <Details :user-info="userInfo" :errors="errors" @update-avatar="updateAvatar" />
    <SocialInformation :user-info="userInfo" :new-social-list="newSocialList" :errors="errors" />
    <DangerZone />
  </Section>
</template>

<style></style>
