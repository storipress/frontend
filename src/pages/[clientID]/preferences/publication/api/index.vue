<script setup lang="ts">
import * as Sentry from '@sentry/vue'
import type { NotificationFactory } from '@storipress/core-component'
import { Buttons as SpButton, Toggles } from '@storipress/core-component'
import publicationLogo from '@assets/group-2.svg'
import ScrapbookInput from '~/components/ScrapbookInput.vue'
import { usePublicationPermission } from '~/composables/permission/publication'
import {
  GenerateNewstandKeyDocument,
  GetSiteCustomSiteDocument,
  UpdateSiteInfoCustomSiteDocument,
} from '~/graphql-operations'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { useCheckFeature } from '~/hooks/useRedirect'
import { Flags, featureLoaded, useFeatureFlag } from '~/lib/feature-flag'
import { useUserSubscription } from '~/composables'

const props = defineProps<{ clientID: string }>()
const router = useRouter()

const enabledCustomSite = useFeatureFlag(Flags.CustomSite)
useCheckFeature(enabledCustomSite, `/${props.clientID}/preferences/publication/details`, featureLoaded)

const { canHostingCustomSite, canGetApiKay } = usePublicationPermission()

const notifications = inject('notifications') as NotificationFactory

const {
  result: siteQuery,
  refetch: refetchSite,
  loading: loadingSite,
} = useFeatureFlaggedQuery(Flags.CustomSite, GetSiteCustomSiteDocument)
const { onTrialFree, canAccessAllPlusFeatures, isPlusPlan, onTrial, isOwner } = useUserSubscription()

// Forbid trial user to access API key (e.g. a trial admin user access a free plan publication)

const isTrialUserWithoutPlan = computed(() => onTrial.value && !isOwner.value && !isPlusPlan.value)
const { mutate: generateNewstandKey } = useMutation(GenerateNewstandKeyDocument)
whenever(
  // when user has no key (if not loaded yet, it will be undefined), and user can access all plus features
  () => siteQuery.value?.site.newstand_key === null && canAccessAllPlusFeatures.value,
  async () => {
    await generateNewstandKey()
    await refetchSite()
  },
)
const newstandKey = computed(() => {
  if (!canGetApiKay.value || !isPlusPlan.value) return ''
  return siteQuery.value?.site.newstand_key || ''
})

async function onRotateApiKey() {
  await generateNewstandKey()
  await refetchSite()

  notifications({
    title: 'Success',
    type: 'primary',
    content: 'The API Key has been successfully regenerated.',
  })
}

const [confirmEnable, confirmDisable] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Warning! This deactivates the site built using Storipress’ no-code site builder.',
    description:
      'Make sure you’ve fully tested your custom front-end. Deploying your Karbon app will take 2-3 minutes and will deactivate your current site you’ve built on Storipress’ no-code site builder.',
    okText: 'Deploy Karbon app',
  },
  {
    type: 'warning',
    title: 'Warning! This deactivates your custom front-end.',
    description:
      'Deactivating your Karbon app is immediate — your publication will revert to using the front-end developed using our no-code site builder.',
    okText: 'Deactivate Karbon App',
  },
])

const { mutate: updateSiteInfo, loading: updatingSiteInfo } = useMutation(UpdateSiteInfoCustomSiteDocument)

const enabled = computed(() => siteQuery.value?.site.custom_site_template)
async function onSwith() {
  if (updatingSiteInfo.value) return

  const confirmFn = enabled.value ? confirmDisable : confirmEnable
  const confirm = await confirmFn()
  if (!confirm) return

  await updateSiteInfo({ input: { custom_site_template: !enabled.value } })
    .then((result) => {
      const customSiteSetting = result?.data?.updateSiteInfo?.custom_site_template
      if (customSiteSetting == null) {
        return Promise.reject(new Error('API fail'))
      }
      notifications(
        customSiteSetting
          ? {
              title: 'Frontend API Access activated',
              type: 'primary',
              content: 'This deactivates the Storipress site builder and site.',
            }
          : {
              title: 'Frontend API Access deactivated',
              type: 'warning',
              content: "Site swapped to Storipress' site builder.",
            },
      )
    })
    .catch((error) => {
      Sentry.captureException(error)
      notifications({
        title: 'Setting not successful',
        type: 'warning',
        iconName: 'warning',
        content: 'Settings change failed. Contact hello@storipress.com',
      })
    })
}

const isLoading = computed(() => loadingSite.value)
</script>

<template>
  <Section v-if="!isLoading" title="Newstand API" class="flex-1">
    <SectionContent sub-title="API Credentials">
      <template #description>
        Programmatically access your publication using the Newstand API. To learn how to use the Newstand API,
        <a href="https://api.storipress.com" target="blank" class="text-sky-700">read our developer docs.</a>
      </template>
      <div
        v-if="canAccessAllPlusFeatures && !isTrialUserWithoutPlan"
        class="ml-14 flex-1 rounded-lg border border-black/5 bg-white p-5 shadow-1-layer"
      >
        <ScrapbookInput
          :input-value="clientID"
          :need-hide="false"
          label="Client ID"
          class="flex-1"
          hint="Client ID Copied"
        />
        <hr class="my-5 border-t border-stone-200" />
        <ScrapbookInput
          need-rotate
          :input-value="newstandKey"
          label="Newstand API key"
          class="flex-1"
          @rotate-api-key="onRotateApiKey"
        />
        <hr class="my-5 border-t border-stone-200" />
        <ScrapbookInput
          :input-value="siteQuery?.site.typesense_search_only_key"
          label="Article Search API key"
          class="flex-1"
        />
      </div>

      <!-- No subscribed plan -->
      <div v-else class="ml-14 flex-1 rounded-lg border border-black/5 bg-white px-20 py-8 shadow-1-layer">
        <img :src="publicationLogo" alt="Publication Logo" class="mx-auto mb-6" />
        <h3 class="mb-2 text-center text-[1.625rem] leading-8 text-stone-800">
          Upgrade your account to access the Newstand API
        </h3>
        <p class="mb-6 text-center text-sm text-stone-500">
          Use Storipress' Newsstand API to programmatically fetch and update data, enabling custom frontends,
          integrations, apps, and more. For guidance on API use,
          <a href="https://api.storipress.com" rel="noopener noreferrer" target="_blank" class="text-sky-700"
            >refer to our developer docs.</a
          >
        </p>
        <SpButton
          type="main"
          color="primary"
          class="mx-auto block"
          @click="router.push(`/${clientID}/account/billing/plans`)"
          >Upgrade account</SpButton
        >
      </div>
    </SectionContent>

    <hr v-if="onTrialFree || (canAccessAllPlusFeatures && canHostingCustomSite)" class="border-stone-200" />

    <SectionContent
      v-if="onTrialFree || (canAccessAllPlusFeatures && canHostingCustomSite)"
      sub-title="Custom Site"
      content="Hosting for a site built with Karbon is included in your plan. Upload your Karbon app here to deploy it on Storipress. For more information on Karbon, read our developer docs."
    >
      <template #description>
        Hosting for a site built with Karbon is included in your plan. Upload your Karbon app here to deploy it on
        Storipress. For more information on Karbon,
        <a href="https://developers.storipress.com" target="blank" class="text-sky-700">read our developer docs.</a>
      </template>
      <div class="ml-14 flex-1 rounded-lg border border-black/5 bg-white p-5 shadow-1-layer">
        <h3 class="text-body mb-1 text-stone-800">1. Upload your Karbon app via the Storipress CLI</h3>
        <p class="text-sm text-stone-500">
          See relevant developer documentation
          <a
            href="https://developers.storipress.com/karbon/2gLtVFS6QEkdvKF7fkRng1/deploying-to-storipress/kGmxiaH1UAPw337mdjQ2uN"
            target="blank"
            class="text-sky-700"
            >here.</a
          >
        </p>

        <hr class="my-5 border-t border-stone-200" />

        <div class="flex items-center">
          <div class="flex-1">
            <h3 class="text-body mb-1 text-stone-800">2. Deploy Karbon app</h3>
            <p class="text-sm text-stone-500">
              Once you’ve uploaded your Karbon app,
              <br />
              turn on this toggle to deploy it to Storipress.
            </p>
          </div>
          <Toggles :disabled="!canHostingCustomSite" type="simple" :checked="enabled" @on-click="onSwith" />
        </div>
      </div>
    </SectionContent>
  </Section>
</template>
