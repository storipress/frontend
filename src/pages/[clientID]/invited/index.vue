<route lang="yaml">
meta:
  layout: workspaces
</route>

<script setup lang="ts">
import * as Sentry from '@sentry/vue'
import Card from './components/Card.vue'
import type { UserInfo } from './definitions'
import { useUserInfo } from './use-user-info'
import { useWorkspaceStore } from '~/stores/workspace'
import { UpdateProfileDocument } from '~/graphql-operations'
import type { GetMeQuery } from '~/graphql-operations'

const router = useRouter()
const { userInfo, checkUserInfo, incompleteAvatar, meStore } = useUserInfo()
checkUserInfo()

const workspaceStore = useWorkspaceStore()
workspaceStore.prepareForUsing()
const publication = computed(() => ({
  name: workspaceStore.currentWorkspace?.name ?? '',
  id: workspaceStore.currentWorkspace?.id ?? '',
}))

const { mutate } = useMutation(UpdateProfileDocument)
async function updateAvatar(avatar: GetMeQuery['me']['avatar']) {
  if (avatar) {
    userInfo.avatar = avatar
  } else if (avatar === null) {
    userInfo.avatar = ''
    await mutate({ input: { avatar } })
  }
  meStore.initialize()
}

async function onSubmit(input: UserInfo) {
  const { firstName, lastName, location, bio } = input
  try {
    await mutate({
      input: {
        first_name: firstName,
        last_name: lastName,
        location,
        bio,
      },
    })
    router.replace(`/${publication.value.id}/articles/desks/all`)
  } catch (error) {
    Sentry.captureException(error)
  }
}
</script>

<template>
  <div class="border-b border-stone-200 px-4 pb-[1.375rem] md:border-b-0 md:pb-0">
    <div class="text-display-large mb-4 text-stone-800">
      {{ incompleteAvatar ? `Complete your profile by adding a profile photo 👉` : `Join ${publication.name}.` }}
    </div>
    <div>
      <p v-if="incompleteAvatar">Show your readers who you are</p>
      <p v-else class="text-button leading-5 text-stone-500 after:content-['👇'] md:after:content-['👉']">
        To accept your invite, finish setting up your profile
      </p>

      <p class="text-body mt-0.5 leading-5 text-stone-500">
        This information is used in {{ publication.name }}'s author page.
      </p>
      <p class="text-body leading-5 text-stone-500">Information here populates your site's author page.</p>
    </div>
  </div>
  <Card
    :user-info="userInfo"
    :publication="publication.name"
    :incomplete-avatar="incompleteAvatar"
    class="pt-[1.875rem]"
    @update-avatar="updateAvatar"
    @submit="onSubmit"
  />
</template>
