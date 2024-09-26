<script lang="ts" setup>
import delay from 'delay'
import ShopifySvg from '@assets/icons-shopify.svg'
import { until } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { useExclusiveIntegration } from '../use-exclusive-integration'
import ShopifyModal from './ShopifyModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import {
  Integrations,
  onFromRedirect,
  useContinueOauth,
  useIntegration,
  useQueryToggle,
  useTutorials,
  useUserSubscription,
} from '~/composables'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useCheckoutDialog } from '~/hooks/useCheckoutDialog'
import { PullShopifyContentDocument } from '~/graphql-operations'
import { useSiteStore } from '~/stores/site'
import { useAuthStore } from '~/stores/auth'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { getFailDialogMessage } from '~/composables/continue-oauth'

defineProps<{ integrationName: string; integrationInfo: string }>()

const { ready, canAccessIntegrations } = usePublicationPermission()

const { value: visible } = useQueryToggle({ key: 'integration', value: Integrations.Shopify })

const siteStore = useSiteStore()

const exclusiveIntegration = useExclusiveIntegration({
  integrationName: 'Shopify',
  conflictKey: Integrations.Webflow,
  conflictName: 'Webflow',
})
const isDisabled = computed(() => {
  const hasSetupCustomDomain = siteStore.site?.site_domain
  if (hasSetupCustomDomain) {
    return {
      disabled: true,
      reason: 'To enable Shopify integration, please disconnect your custom domain first',
    }
  }
  return exclusiveIntegration.value
})

const { isActivated, thirdPartyData, onActivate, onSwitch } = useIntegration(Integrations.Shopify)

const { openDialog, isFreePlan } = useCheckoutDialog()
const { onTrialFree } = useUserSubscription()

async function onSwitchHandler() {
  if (!onTrialFree.value && isFreePlan.value) {
    const done = await openDialog('standard', 'shopify')
    if (!done) return null
  }

  if (!isActivated.value && !thirdPartyData.value) {
    visible.value = true
  }
  onSwitch(false)
  return null
}

const { mutate: pullShopifyContent } = useMutation(PullShopifyContentDocument)
const { setTutorials } = useTutorials()

const loading = ref(false)

const code = useRouteQuery('code', '')
const fromClientId = useStorage('from-client-id', '')
const fromOnboarding = useStorage('from-onboarding', false)
const authStore = useAuthStore()

const continueOauth = useContinueOauth({
  integration: Integrations.Shopify,
  code,
})

const confirmData = ref()
const [confirmOauthFail] = useConfirmFunction(
  computed(() => [
    confirmData.value?.shopify ?? {
      type: 'warning',
      title: 'Integration failed.',
      description: 'Please try again.',
      okText: 'OK',
      cancelButtonClass: 'hidden',
    },
  ]),
)

onFromRedirect(async () => {
  const clientId = fromClientId.value ? fromClientId.value : authStore.clientID

  if (visible.value) {
    await startLoading()
    if (!ready.value) {
      await until(ready).toBeTruthy()
    }

    if (!canAccessIntegrations.value) {
      return false
    }

    const oauthResult = await continueOauth(clientId)
    const normalizedOauth =
      typeof oauthResult === 'number'
        ? {
            success: false,
            errorCode: oauthResult,
          }
        : {
            success: oauthResult,
            errorCode: undefined,
          }

    if (!normalizedOauth.success) {
      confirmData.value = getFailDialogMessage(normalizedOauth.errorCode)
      await confirmOauthFail()
      return
    }

    await siteStore.fetchSiteTutorials()
    await setTutorials(['setDomain', 'setCustomiseTheme'])
    // ensure shopify is connect, or at next step, we will got an API error
    await onActivate(false)
    await pullShopifyContent()
  }
  visible.value = false
})

async function startLoading() {
  loading.value = true
  await delay(3000)
  loading.value = false
  fromClientId.value = null
  fromOnboarding.value = false
}
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="ShopifySvg"
    :disabled="isDisabled"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitchHandler"
  />
  <ShopifyModal v-model="visible" :loading="loading" referrer="integration" />
</template>

<style></style>
