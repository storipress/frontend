<script setup lang="ts">
import ShopifySvg from '@assets/icons-shopify.svg'
import { logicNot } from '@vueuse/math'
import { LoadingSpinner } from '@storipress/core-component'
import { useRouteQuery } from '@vueuse/router'
import ShopifyGroup from '@assets/group-7.webp'
import { INTEGRATIONS_INFO } from '../../definition'
import Instructions from './components/Instructions.vue'
import SettingPanel from './components/SettingPanel.vue'
import ShopifyNotify from './components/ShopifyNotify.vue'
import { BasicDialog, InfoDialog } from '~/components/Integrations'
import { PullShopifyContentDocument, PullShopifyCustomersDocument, ReleasesDocument } from '~/graphql-operations'
import { dayjs } from '~/lib/dayjs'
import { Integrations, useEcho, useIntegration, useNotification, useUserSubscription } from '~/composables'
import { useCheckoutDialog } from '~/hooks/useCheckoutDialog'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  referrer: 'migration' | 'integration' | 'onboarding'
}>()

const route = useRoute()
const router = useRouter()
const querySetup = useRouteQuery('setup')

const {
  visible,
  thirdPartyData,
  activatedTime,
  isActivated,
  authorizedAndEnabled,
  integrationData,
  onActivate,
  onUpdate,
  getThirdPartyApi,
} = useIntegration(Integrations.Shopify)

whenever(logicNot(visible), () => {
  querySetup.value = null
})
const modelValue = useVModel(props)
syncRef(modelValue, visible)

const shopifyIntegration = INTEGRATIONS_INFO[Integrations.Shopify]
const IGNORE = new Set(['clientID-onboarding-first-feature', 'clientID-onboarding-migrate'])

const showNotify = computed(() => {
  return authorizedAndEnabled.value && !IGNORE.has(route.name as string) && !integrationData.value?.first_setup_done
})

const { result, refetch } = useQuery(ReleasesDocument)
const shopifyBuildDone = computed(() => {
  if (!activatedTime.value || result.value?.releases?.data.length === 0) return false
  const currentTime = dayjs()
  const lastReleaseTime = result.value?.releases?.data[0].created_at

  const lastUpdatedTime = integrationData.value.updated_at || activatedTime.value
  // unable to query in the releases response immediately after the update
  const thirtySecondsAgo = currentTime.subtract(30, 'second')
  const notInReleasesQueue = dayjs(lastUpdatedTime).isBetween(thirtySecondsAgo, currentTime)
  if (notInReleasesQueue) return false

  const fiveMinutesAgo = dayjs(lastReleaseTime).subtract(5, 'minute')
  const inReleasesQueue = dayjs(lastUpdatedTime).isBetween(fiveMinutesAgo, lastReleaseTime)

  if (inReleasesQueue) {
    return result.value?.releases?.data[0].state === 'done'
  } else {
    return true
  }
})

const fromClientId = useStorage('from-client-id', '')
const fromOnboarding = useStorage('from-onboarding', false)
const { openDialog, isFreePlan } = useCheckoutDialog()
const { onTrialFree } = useUserSubscription()

const url = computed(() => getThirdPartyApi(props.referrer))

async function onConnectShopify() {
  if (!onTrialFree.value && isFreePlan.value) {
    const done = await openDialog('standard', 'shopify')
    if (!done) return null
  }

  fromOnboarding.value = props.referrer === 'onboarding'
  fromClientId.value = route.params.clientID as string

  location.href = url.value
  return null
}

const { create: notifications } = useNotification()

// ! must after `updateIntegrationForm` as backend will verify `sync_customers` value
const { mutate } = useMutation(PullShopifyCustomersDocument)

const { mutate: pullShopifyContent } = useMutation(PullShopifyContentDocument)

async function onActivateShopify() {
  updateInfo()
  await onActivate()

  if (integrationData.value.sync_customers) {
    mutate()
  }
}

async function onUpdateShopify() {
  updateInfo()
  await onUpdate()

  if (integrationData.value.sync_customers) {
    mutate()
  }
}

async function onSyncShopifyContent() {
  const result = await pullShopifyContent()
  if (result) {
    notifications({
      title: 'Syncing Shopify content started',
      type: 'primary',
    })
  } else {
    notifications({
      title: 'Syncing Shopify content failed',
      type: 'warning',
      iconName: 'warning',
      content: 'Please try again.',
    })
  }
}

function onComplete() {
  onUpdate(false)
  visible.value = false
}

function updateInfo() {
  const currentTime = dayjs()
  integrationData.value.updated_at = currentTime.toString()
  if (typeof integrationData.value?.sync_customers === 'undefined') {
    integrationData.value.sync_customers = true
  }
}

function onCompleteShopify() {
  router.push({ path: router.currentRoute.value.path, query: { setup: 'first' } })

  visible.value = true
}

const { onNotification, EchoEvent } = useEcho()
onNotification(async ({ type }) => {
  if (!activatedTime.value) return

  const isDone = type === EchoEvent.site.deployment.succeeded
  if (!isDone) return

  const currentTime = dayjs()
  const lastUpdatedTime = integrationData.value.updated_at || activatedTime.value
  const thirtySecondsAgo = currentTime.subtract(30, 'second')
  const notInReleasesQueue = dayjs(lastUpdatedTime).isBetween(thirtySecondsAgo, currentTime)
  if (notInReleasesQueue) return

  await refetch()
})
</script>

<template>
  <BasicDialog
    v-model="visible"
    :integration-name="shopifyIntegration.name"
    :info="shopifyIntegration.info"
    :img="ShopifySvg"
    v-bind="$attrs"
  >
    <div v-if="loading" class="flex min-h-[27rem] flex-col">
      <LoadingSpinner show spin-width="w-[6.25rem]" class="mt-[6.625rem]" />
      <p class="text-display-medium mt-14 text-center text-neutral-800">Connecting to Shopify…</p>
    </div>
    <template v-else>
      <InfoDialog
        v-if="!thirdPartyData"
        :img="ShopifyGroup"
        title="Connect Storipress to your Shopify Store"
        content="Experience the full power of Storipress on Shopify"
        button-text="Connect account"
        @click-button="onConnectShopify"
      />

      <template v-else>
        <Instructions
          v-if="querySetup === 'first'"
          v-model:query-setup="querySetup"
          :visible="visible"
          :img="ShopifyGroup"
          :integration-data="integrationData"
          :is-activated="isActivated"
          @complete-instructions="onComplete"
        />
        <SettingPanel
          v-else
          v-model:integration-data="integrationData"
          :is-activated="isActivated"
          @activate="onActivateShopify"
          @update="onUpdateShopify"
          @sync="onSyncShopifyContent"
        />
      </template>
    </template>
  </BasicDialog>

  <ShopifyNotify v-if="showNotify" :shopify-build-done="shopifyBuildDone" @click-notify="onCompleteShopify" />
</template>
