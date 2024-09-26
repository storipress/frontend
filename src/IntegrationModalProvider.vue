<script setup lang="ts">
import { useGlobalIntegration } from './stores/global-integration'
import ShopifyModal from '~/pages/[clientID]/preferences/publication/integrations/components/Shopify/ShopifyModal.vue'
import WebflowModel from '~/pages/[clientID]/preferences/publication/integrations/components/Webflow/WebflowModel.vue'
import LinkedInNotify from '~/pages/[clientID]/preferences/publication/integrations/components/LinkedIn/LinkedInNotify.vue'
import { usePublicationPermission } from '~/composables/permission/publication'

const { canUseIntegrations } = usePublicationPermission()

const IGNORE = new Set([
  'clientID-preferences-publication-integrations',
  'clientID-onboarding-migrate',
  'clientID-publication-import',
])
const route = useRoute()
const showWebflow = computed(() => {
  return route.name && !IGNORE.has(route.name as string)
})

const globalIntegration = useGlobalIntegration()

const webflowVisible = computed({
  get() {
    return globalIntegration.webflow.visible
  },
  set(val: boolean) {
    if (val) {
      globalIntegration.showWebflow()
    } else {
      globalIntegration.hideWebflow()
    }
  },
})

const webflowHooks = computed(() => globalIntegration.webflow.hooks)
</script>

<template>
  <ShopifyModal v-if="canUseIntegrations" :model-value="false" referrer="integration" />
  <WebflowModel
    v-if="showWebflow && canUseIntegrations"
    v-model="webflowVisible"
    :hooks="webflowHooks"
    referrer="integration"
  />
  <LinkedInNotify />
</template>
