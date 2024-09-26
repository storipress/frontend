<script setup lang="ts">
import WebflowSvg from '@assets/icons-webflow.svg'
import { useExclusiveIntegration } from '../use-exclusive-integration'
import WebflowModel from './WebflowModel.vue'
import { useWebflowState } from './composables/useWebflowState'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations as IntegrationsKey, onFromRedirect, useQueryToggle, useTutorials } from '~/composables'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useSiteStore } from '~/stores/site'

defineProps<{ integrationName: string }>()

const { value: visible } = useQueryToggle({ key: 'integration', value: IntegrationsKey.Webflow })

const { webflowActivated, activateWebflow, deactivateWebflow } = useWebflowState()
const siteStore = useSiteStore()

const exclusiveIntegration = useExclusiveIntegration({
  integrationName: 'Webflow',
  conflictKey: IntegrationsKey.Shopify,
  conflictName: 'Shopify',
})
const isDisabled = computed(() => {
  const hasSetupCustomDomain = siteStore.site?.site_domain
  if (hasSetupCustomDomain) {
    return {
      disabled: true,
      reason: 'To enable Webflow integration, please disconnect your custom domain first',
    }
  }
  return exclusiveIntegration.value
})

const { ready, canAccessIntegrations } = usePublicationPermission()

const { setTutorials } = useTutorials()
onFromRedirect(async () => {
  if (!visible.value) return

  if (!ready.value) {
    await until(ready).toBeTruthy()
  }

  if (!canAccessIntegrations.value) {
    return false
  }

  await setTutorials(['setDomain', 'setCustomiseTheme'])
  activateWebflow()
})

function onSwitchHandler() {
  if (webflowActivated.value) {
    deactivateWebflow()
  } else {
    activateWebflow()
    visible.value = true
  }
}
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="WebflowSvg"
    :disabled="isDisabled"
    :enabled="webflowActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitchHandler"
  />
  <WebflowModel v-model="visible" />
</template>
