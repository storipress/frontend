<route lang="yaml">
meta:
  layout: workspaces
</route>

<script setup lang="ts">
import { Alert, Buttons, Icon, Inputs, NOTIFICATION_KEY, Textarea } from '@storipress/core-component'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import confetti from 'canvas-confetti'
import { useCreateSite } from '~/composables/create-site'
import { Flags, useFeatureFlag } from '~/lib/feature-flag'
import type { GetBillingQuery, GetMeEmailQuery } from '~/graphql-operations'
import { GetBillingDocument, GetMeEmailDocument, ResendConfirmEmailDocument } from '~/graphql-operations'
import { useUserTimezone } from '~/composables/timezones'
import { useWorkspaceStore } from '~/stores/workspace'
import { RedirectTarget, useContinueOauth, useFromRedirect, useRedirectPortal } from '~/composables'

useHead({
  title: 'Create publication - Storipress',
})

const currentStep = ref(0)
const publicationName = ref('')
const inviteEmails = ref('')
const inviteesList = ref([] as string[])
const { result } = useQuery(GetMeEmailDocument)
const me = computed(() => {
  return result.value?.me ?? ({} as GetMeEmailQuery['me'])
})

const { result: billingResult } = useQuery(GetBillingDocument)
const workspaceStore = useWorkspaceStore()
const overQuota = computed(() => {
  const { publications_count: count, publications_quota: quota } =
    billingResult.value?.billing ?? ({} as GetBillingQuery['billing'])
  return quota - count <= 0
})
const defaultOwnerClientId = computed(() => {
  return workspaceStore.workspaces?.find((workspace) => workspace.role === 'owner')?.id
})

const enabledScrapeMigrator = useFeatureFlag(Flags.ScrapeMigrator)
const { isFromRedirect } = useFromRedirect()
const route = useRoute()
const continueOauth = useContinueOauth({
  code: route.query.code as string,
  integration: route.query.integration as string,
})
const portal = useRedirectPortal()
const { mutate, clientID } = useCreateSite(async (id: string, redirect) => {
  await workspaceStore.reInitialize()
  if (isFromRedirect.value) {
    await continueOauth(id)

    return portal({
      ...route.query,
      to: RedirectTarget.Onboarding,
      client_id: id,
    })
  }
  const path = enabledScrapeMigrator.value ? `/${clientID.value}/onboarding/migrate` : undefined
  return redirect(path)
})

const validateEmail = Yup.string().trim().required().email()
const schema = Yup.object().shape({
  publicationName: Yup.string().required('Publication name is a required field'),
})

const inviteEmailList = computed(() => {
  if (!inviteEmails.value) return []
  const result = inviteEmails.value.split(',')
  return result.map((item) => item.trim())
})

function onNextStep() {
  if (!overQuota.value) currentStep.value = 1
}

function onCreateSite() {
  mutate({
    input: {
      name: publicationName.value,
      invites: inviteesList.value,
      timezone: useUserTimezone(),
    },
  })
}

const errorMessage = ref(new Set<string>())
watch(inviteEmailList, (val) => {
  const validEmails = new Set<string>()
  errorMessage.value.clear()
  for (const email of val) {
    if (validateEmail.isValidSync(email)) {
      validEmails.has(email) && errorMessage.value.add('There is a duplicate email in your email list')
      validEmails.add(email)
    } else {
      errorMessage.value.add('One of your emails is not a valid email')
    }
  }
  inviteesList.value = [...validEmails]
})

watch(inviteesList, (newVal, preVal) => {
  if (newVal.length <= 5 && newVal.length > preVal.length) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.6 },
      angle: 135,
    })
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.75 },
      angle: 45,
    })
  }
})

const notifications = inject(NOTIFICATION_KEY)
const { mutate: resendConfirmEmail } = useMutation(ResendConfirmEmailDocument)
async function onResendVerification() {
  await resendConfirmEmail()
  notifications?.({
    title: 'Email verification resent',
    type: 'primary',
    content: 'Check your inbox for the email!',
  })
}
</script>

<template>
  <!-- step 1 publication name -->
  <div v-if="currentStep === 0" class="mx-auto px-4 md:w-[28.5rem]">
    <div class="text-display-large mb-4 text-stone-800">Create a publication</div>
    <div class="text-body mb-8 text-stone-500">
      This publication will be connected to <b>{{ me.email }}</b>
    </div>

    <Alert v-if="overQuota" message="You cannot create any new publications" type="warning" class="mb-8">
      <template #description>
        <div class="text-body text-stone-800">
          You have reached the maximum amount of publications for your account. To create a new publication, delete a
          publication, contact support, or
          <router-link :to="`/${defaultOwnerClientId}/account/billing`">
            <u>upgrade your plan</u>
            <i class="icon-goto-url ml-1 text-xs" />
          </router-link>
          .
        </div>
      </template>
    </Alert>

    <Form :validation-schema="schema" @submit="onNextStep">
      <Inputs v-model="publicationName" label="Publication name" class="mb-8" html-name="publicationName" />
      <Buttons type="main" color="primary" is-shadow html-type="submit" :disabled="overQuota || !publicationName">
        Create publication
      </Buttons>
    </Form>
  </div>

  <!-- step 2 user invite -->
  <div v-if="currentStep === 1" class="mx-auto px-4 md:w-[28.5rem]">
    <div class="text-display-large mb-4 text-stone-800">Invite your team</div>
    <div class="text-body mb-8 flex flex-col text-stone-500">
      <span>
        <b>Earn up to $30 credit for each user you invite.</b> Credits are activated if a writer joins Storipress using
        your invite and are automatically redeemed every billing cycle.
      </span>
    </div>

    <Alert v-if="overQuota" message="You cannot create any new publications" type="warning" class="mb-8">
      <template #description>
        <div class="text-body text-stone-800">
          You have reached the maximum amount of publications for your account. To create a new publication, delete a
          publication, contact support, or
          <router-link :to="`/${defaultOwnerClientId}/account/billing`">
            <u>upgrade your plan</u>
            <i class="icon-goto-url ml-1 text-xs" />
          </router-link>
          .
        </div>
      </template>
    </Alert>

    <Textarea
      v-model="inviteEmails"
      label="Invite your team. Enter their emails, separated by commas."
      placeholder="john@doe.com, jane@doe.com ..."
      textarea-height="h-[10.25rem]"
      textarea-width="w-[calc(100vw-2rem)] md:w-[26.5rem]"
      :class="{ 'mb-8': !errorMessage.size }"
    />
    <div class="text-caption mb-8 text-red-700">
      <span v-for="(item, index) in errorMessage" :key="index">
        {{ item + (errorMessage.size === index + 1 ? '' : ', ') }}
      </span>
    </div>

    <Buttons
      v-if="inviteEmails"
      type="main"
      color="primary"
      is-shadow
      html-type="submit"
      :disabled="overQuota || !!errorMessage.size"
      @click="onCreateSite"
    >
      Invite users
    </Buttons>
    <Buttons
      v-else
      type="main"
      is-shadow
      :disabled="overQuota"
      class="border-0 bg-stone-200 text-stone-500"
      @click="onCreateSite"
    >
      Skip
    </Buttons>
  </div>

  <div
    v-if="currentStep === 1"
    class="layer-2 fixed left-1/2 top-1/2 h-[20.5rem] w-[18.25rem] -translate-y-1/2 translate-x-1/2 rounded-lg bg-white p-6 pt-4"
  >
    <div class="text-heading mb-6 flex flex-col text-stone-800">
      <span class="font-semibold">Earn up to $30 credit</span>
      <span>for inviting your team</span>
    </div>

    <div v-for="i in 5" :key="i" class="mb-4 flex items-center">
      <span class="text-body mr-3 basis-7" :class="inviteesList.length >= i ? 'text-stone-800' : 'text-stone-400'">
        ${{ i * 5 }}
      </span>
      <div class="relative">
        <div
          v-if="5 - i !== 0"
          :class="inviteesList.length >= i ? 'after:bg-emerald-600' : 'after:bg-gray-200'"
          class="absolute flex size-8 justify-center after:absolute after:top-full after:h-full after:w-0.5"
        />
        <div
          :class="inviteesList.length >= i ? 'bg-emerald-600' : 'border-2 border-gray-200 bg-white'"
          class="mr-4 flex size-8 items-center justify-center rounded-2xl transition duration-100 ease-in-out"
        >
          <Icon v-if="inviteesList.length >= i" icon-name="tick" class="text-xs text-white" />
          <div v-else class="size-2.5 rounded-2xl bg-gray-200" />
        </div>
      </div>
      <span class="text-caption text-stone-800">
        Invite <b>{{ i }} Team {{ i > 1 ? 'Members' : 'Member' }}</b>
      </span>
    </div>
  </div>
</template>

<style scoped></style>
