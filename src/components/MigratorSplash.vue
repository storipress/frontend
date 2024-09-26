<script lang="ts" setup>
import { HoverHint, Icon } from '@storipress/core-component'
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
import shopifyLogo from '@assets/icons-shopify.svg'
import webflowLogo from '@assets/icons-webflow.svg'
import wordpressLogo from '@assets/icons-wordpress.svg'
import { useExclusiveIntegration } from '~/pages/[clientID]/preferences/publication/integrations/components/use-exclusive-integration'
import ShopifyModal from '~/pages/[clientID]/preferences/publication/integrations/components/Shopify/ShopifyModal.vue'
import WebflowModel from '~/pages/[clientID]/preferences/publication/integrations/components/Webflow/WebflowModel.vue'
import { useFeatureFlag } from '~/lib/feature-flag'
import { Integrations as IntegrationsKey, useFromRedirect, useIntegration, useIntegrationUtils } from '~/composables'

defineProps<{ clientId: string }>()

const route = useRoute()
const { automatic } = route.query

const enableShopify = useFeatureFlag('shopify-integration')
const enableWebflow = useFeatureFlag('webflow-integration')

const { getThirdPartyData, isThirdPartyEnabled } = useIntegrationUtils()

const keepMigrate = ref(Boolean(automatic))
watch(
  () => route.query,
  (query) => {
    keepMigrate.value = Boolean(query.automatic)
  },
)

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

const { isFromRedirect, clearRedirectFlag } = useFromRedirect()
const { onActivate } = useIntegration(IntegrationsKey.Shopify)

whenever(shopifyData, () => {
  if (isFromRedirect.value) {
    onActivate(false)
    clearRedirectFlag()
  }
})

function onSetupShopify() {
  if (shopifyDisabled.value.status) {
    return
  }
  shopifyModelVisible.value = true
}
function onSetupWebflow() {
  if (webflowDisabled.value.status) {
    return
  }
  webflowModelVisible.value = true
}
</script>

<template>
  <Transition
    mode="out-in"
    enter-active-class="transition duration-75 ease-out"
    enter-from-class="transform translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    appear
  >
    <div
      v-if="clientId"
      class="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-stone-50"
    >
      <RouterLink :to="`/${clientId}/`" replace class="absolute left-[3.5rem] top-[5.5rem]">
        <img :src="spLogo" alt="Storipress logo" class="h-8" />
      </RouterLink>

      <div v-if="!keepMigrate" class="flex flex-wrap justify-center gap-8">
        <RouterLink :to="{ query: { migrate: 'true', automatic: 'true' } }" class="card">
          <Icon icon-name="refresh" class="icon" />
          <h2 class="card-title">I want to migrate an existing publication</h2>
          <p class="card-text">Use Storipress’ automatic migration to copy your content across in 5 minutes.</p>
        </RouterLink>
        <div v-if="enableShopify" class="relative">
          <HoverHint :disabled="!shopifyDisabled.status || !shopifyDisabled.reason">
            <template #default>
              <div
                role="button"
                class="card"
                :class="{ 'card-disable': shopifyDisabled.status }"
                @click="onSetupShopify"
              >
                <img :src="shopifyLogo" class="icon mx-auto size-16" />
                <h2 class="card-title">I am using Storipress with Shopify</h2>
                <p class="card-text">Write + manage your content team from our purpose built interface.</p>
              </div>
            </template>
            <template #content>
              <div class="text-body max-w-sm whitespace-break-spaces text-white">
                {{ shopifyDisabled.reason }}
              </div>
            </template>
          </HoverHint>
          <Icon
            v-if="shopifyEnabled"
            icon-name="circle-tick"
            class="absolute -right-3 -top-3 text-5xl text-emerald-700 duration-75 ease-in-out"
          />
        </div>
        <div v-if="enableWebflow" class="relative">
          <HoverHint :disabled="!webflowDisabled.status || !webflowDisabled.reason">
            <template #default>
              <div
                role="button"
                class="card"
                :class="{ 'card-disable': webflowDisabled.status }"
                @click="onSetupWebflow"
              >
                <img :src="webflowLogo" class="icon mx-auto size-16" />
                <h2 class="card-title">I am using Storipress with Webflow</h2>
                <p class="card-text">Write + manage your content team from our purpose built interface.</p>
              </div>
            </template>
            <template #content>
              <div class="text-body max-w-sm whitespace-break-spaces text-white">
                {{ webflowDisabled.reason }}
              </div>
            </template>
          </HoverHint>
          <Icon
            v-if="webflowEnabled"
            icon-name="circle-tick"
            class="absolute -right-3 -top-3 text-5xl text-emerald-700 duration-75 ease-in-out"
          />
        </div>
        <RouterLink :to="`/${clientId}/articles/desks/all`" replace class="card">
          <Icon icon-name="light-bulb" class="icon" />
          <h2 class="card-title">I want to create a new publication</h2>
          <p class="card-text">Don’t worry, you can always use our migrator later!</p>
        </RouterLink>
      </div>

      <div v-else class="flex gap-8">
        <RouterLink :to="`/${clientId}/publication/import-wp`" class="card">
          <img :src="wordpressLogo" class="icon mx-auto size-16" />
          <h2 class="card-title">I’m migrating from WordPress</h2>
          <p class="card-text">Use Storipress’ automatic migration to copy your content across in 5 minutes.</p>
        </RouterLink>
        <RouterLink :to="`/${clientId}/publication/import`" class="card">
          <Icon icon-name="refresh" class="icon" />
          <h2 class="card-title">I’m migrating from another platform</h2>
          <p class="card-text">Use Storipress’ automatic migration to copy your content across in 5 minutes.</p>
        </RouterLink>
      </div>
    </div>
  </Transition>

  <ShopifyModal v-if="route.params.clientID" v-model="shopifyModelVisible" class="z-[9999]" referrer="migration" />
  <WebflowModel v-if="route.params.clientID" v-model="webflowModelVisible" class="z-[9999]" referrer="migration" />
</template>

<style scoped lang="scss">
.card {
  @apply w-80 rounded-lg bg-white p-8 pt-[2.625rem] text-center shadow-1-layer transition-shadow duration-300 hover:shadow-3-layer;
}
.card-disable {
  @apply opacity-50 hover:cursor-not-allowed hover:shadow-0-layer;
}

.icon {
  @apply mb-[2.625rem] block text-[4rem] text-[#5d5c5d];
}

.card-title {
  @apply text-display-small mb-2 text-stone-800;
}

.card-text {
  @apply text-body text-stone-500;
}
</style>
