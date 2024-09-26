<route lang="yaml">
meta:
  layout: workspaces
</route>

<script setup lang="ts">
import { captureException } from '@sentry/vue'
import { logicAnd } from '@vueuse/math'
import delay from 'delay'
import shopifyLogo from '@assets/icons-shopify.svg'
import webflowLogo from '@assets/icons-webflow.svg'
import wordpressLogo from '@assets/icons-wordpress.svg'
import demoLogo from '@assets/icons-other-cms.png'
import { HoverHint, Icon } from '@storipress/core-component'
import { onBeforeRouteLeave } from 'vue-router'
import type { NestedHooks } from 'hookable'
import { getQuery } from 'ufo'
import OnboardingCard from './components/OnboardingCard.vue'
import { useExclusiveIntegration } from '~/pages/[clientID]/preferences/publication/integrations/components/use-exclusive-integration'
import ShopifyModal from '~/pages/[clientID]/preferences/publication/integrations/components/Shopify/ShopifyModal.vue'
import type { WebflowHooks } from '~/pages/[clientID]/preferences/publication/integrations/components/Webflow'
import { WebflowModel } from '~/pages/[clientID]/preferences/publication/integrations/components/Webflow'
import {
  Integrations as IntegrationsKey,
  useFromRedirect,
  useIntegration,
  useIntegrationUtils,
  useNoPermissionRedirect,
  useNotification,
  useTutorials,
} from '~/composables'
import { usePublicationPermission } from '~/composables/permission/publication'
import { SetupWordpressDocument } from '~/graphql-operations'
import { mutate } from '~/lib/apollo'

const props = defineProps<{ clientID: string }>()

const route = useRoute()
const router = useRouter()

const webflowHooks: NestedHooks<WebflowHooks> = {
  async afterAuth({ loading, close }) {
    // Let the user see loading before closing the dialog
    await loading(2000, 'Connecting to Webflow...')
    close()
    router.push(`/${route.params.clientID}/onboarding/first-feature`)
  },
}

const { canUseIntegrations } = usePublicationPermission()
useNoPermissionRedirect('canAccessOnboarding', () => `/${route.params.clientID}/articles/desks/all`)

const { isReady, getThirdPartyData, isThirdPartyEnabled } = useIntegrationUtils()

onBeforeRouteLeave(() => {
  sendTrackUnchecked('onboarding_step_completed', {
    step: 4,
    stepName: 'migrate',
  })
})

const shopifyModelVisible = ref(false)
const webflowModelVisible = ref(false)

const shopifyData = getThirdPartyData(IntegrationsKey.Shopify)
const shopifyEnabled = isThirdPartyEnabled(IntegrationsKey.Shopify)
const webflowEnabled = isThirdPartyEnabled(IntegrationsKey.Webflow)

const shopifyExclusive = useExclusiveIntegration({
  integrationName: 'Shopify',
  conflictKey: IntegrationsKey.Webflow,
  conflictName: 'Webflow',
})
const webflowExclusive = useExclusiveIntegration({
  integrationName: 'Webflow',
  conflictKey: IntegrationsKey.Shopify,
  conflictName: 'Shopify',
})
const shopifyDisabled = computed(() => {
  if (typeof shopifyExclusive.value === 'boolean') {
    return { status: shopifyExclusive.value, reason: '' }
  }
  const { disabled: status, reason } = shopifyExclusive.value
  return { status, reason }
})
const webflowDisabled = computed(() => {
  if (typeof webflowExclusive.value === 'boolean') {
    return { status: webflowExclusive.value, reason: '' }
  }
  const { disabled: status, reason } = webflowExclusive.value
  return { status, reason }
})

const migrateOptions = ref([
  {
    image: shopifyLogo,
    title: 'Connect your Shopify store',
    info: 'Manage your Shopify blog using Storipress by first connecting your Shopify store.',
    status: shopifyEnabled,
    enable: ref(true),
    disable: shopifyDisabled,
    handler: onSetupShopify,
  },
  {
    image: webflowLogo,
    title: 'Connect your Webflow site',
    info: 'Manage your Webflow content using Storipress by first connecting your Webflow site.',
    status: webflowEnabled,
    enable: ref(true),
    disable: webflowDisabled,
    handler: onSetupWebflow,
  },
  {
    image: wordpressLogo,
    title: 'Connect your Wordpress site',
    info: 'Manage your Wordpress content using Storipress by installing our WordPress plugin.',
    // usually not possible to be true at here
    // TODO: change to real value
    status: ref(false),
    enable: ref(true),
    // TODO: change to real value
    disable: ref(false),
    handler: onSetupWordpress,
  },
  {
    image: demoLogo,
    title: 'Another platform',
    info: 'For other CMSs like Contentful or Sitecore, our team will setup for you ❤️ set up a time to chat!',
    status: ref(false),
    enable: ref(true),
    disable: ref(false),
    handler: () => {
      sendTrack('onboarding_demo_clicked')
      openPageAndNext('https://cal.com/alexpan/discovery')
    },
  },
])

const { create: notification } = useNotification()
const { isFromRedirect, clearRedirectFlag } = useFromRedirect()
const { onActivate } = useIntegration(IntegrationsKey.Shopify)
const { setTutorials } = useTutorials()

const loading = ref(false)
const fromClientId = useStorage('from-client-id', '')
const fromOnboarding = useStorage('from-onboarding', false)
const redirect = useStorage('redirect-path', '', sessionStorage)

whenever(logicAnd(isReady, redirect), async () => {
  const clientId = route.params.clientID as string
  const { integration, code } = getQuery(redirect.value)

  if (integration === 'wordpress') {
    try {
      await continueWordpressOauth(clientId, { code: code as string })
      await setTutorials('setDomain')

      sendTrack('wordpress_onboarding_succeeded')
      notification({
        title: 'WordPress integration has been activated',
      })
      router.push(`/${clientId}/onboarding/first-feature`)
    } catch (error) {
      captureException(error)
      sendTrack('wordpress_onboarding_failed')
      notification({
        type: 'warning',
        iconName: 'warning',
        title: 'WordPress integration activation failed. Please try again.',
      })
    }

    redirect.value = null
  }
})

whenever(shopifyData, async () => {
  if (isFromRedirect.value) {
    shopifyModelVisible.value = true
    await startLoading()
    shopifyModelVisible.value = false

    onActivate(false)
    clearRedirectFlag()
    router.push(`/${props.clientID}/onboarding/first-feature`)
  }
})

async function startLoading() {
  loading.value = true
  await delay(3000)
  loading.value = false
  fromClientId.value = null
  fromOnboarding.value = false
}

function onSetupShopify() {
  if (shopifyEnabled.value || shopifyDisabled.value.status) {
    return
  }
  shopifyModelVisible.value = true
}
function onSetupWebflow() {
  if (webflowEnabled.value || webflowDisabled.value.status) {
    return
  }
  webflowModelVisible.value = true
}
function onSetupWordpress() {
  sendTrack('wordpress_onboarding_started', { source: 'onboarding' })
  openPageAndNext('https://wordpress.org/plugins/storipress/')
}

function openPageAndNext(url: string) {
  window.open(url, '_blank')
  router.push(`/${props.clientID}/onboarding/first-feature`)
}

function continueWordpressOauth(clientID: string, variables: { code: string }) {
  return mutate(clientID, SetupWordpressDocument, variables)
}
</script>

<template>
  <div class="px-4 md:w-[26rem]">
    <div class="mb-10">
      <h1 class="text-display-large mb-4 text-stone-800">Are you using Storipress with Shopify or Webflow?</h1>
      <h2 class="text-body mb-8 text-stone-500">
        If you’re using Storipress to manage content on these platforms, connect your account now.
      </h2>
    </div>

    <div class="flex flex-col gap-y-3">
      <template v-for="(option, index) in migrateOptions" :key="index">
        <div v-if="option.enable" class="relative">
          <HoverHint :disabled="!option.disable.status || !option.disable.reason">
            <template #default>
              <OnboardingCard
                :image="option.image"
                :title="option.title"
                :info="option.info"
                :disabled="!isReady || option.status || option.disable.status"
                @on-click="
                  () => {
                    option.handler()
                  }
                "
              />
            </template>
            <template #content>
              <div class="text-body max-w-sm whitespace-break-spaces text-white">
                {{ option.disable.reason }}
              </div>
            </template>
          </HoverHint>
          <Icon
            v-if="option.status"
            icon-name="circle-tick"
            class="absolute -right-2 -top-2 text-2xl text-emerald-700 duration-75 ease-in-out"
          />
        </div>
      </template>
      <OnboardingCard
        icon="circle-tick"
        title="Skip integration"
        info="Ok! You can dive straight into Storipress and integrate later."
        @on-click="router.push(`/${clientID}/onboarding/first-feature`)"
      />
    </div>
  </div>

  <ShopifyModal
    v-if="route.params.clientID && canUseIntegrations"
    v-model="shopifyModelVisible"
    referrer="onboarding"
    :loading="loading"
  />
  <WebflowModel
    v-if="route.params.clientID && canUseIntegrations"
    v-model="webflowModelVisible"
    :hooks="webflowHooks"
  />
</template>
