<script setup lang="ts">
import HubspotSvg from '@assets/icons-hubspot.svg'
import HubspotIntegration from './HubspotIntegration.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useQueryToggle } from '~/composables'
import { HubSpotInfoDocument } from '~/graphql-operations'
import type { IntegrationSource } from '~/schema/integration'

withDefaults(
  defineProps<{
    integrationName: string
    integrationInfo: string
    source?: IntegrationSource
  }>(),
  { source: 'settings' },
)

const { value: visible } = useQueryToggle({ key: 'integration', value: Integrations.Hubspot })

const { result: hubSpotInfoResult } = useQuery(HubSpotInfoDocument)

const activateStatus = computed(() => hubSpotInfoResult.value?.hubSpotInfo.activated_at)

function switchHandler() {
  visible.value = true
}
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="HubspotSvg"
    :enabled="activateStatus"
    @on-modal-open="visible = true"
    @on-switch="switchHandler"
  />
  <HubspotIntegration
    v-model="visible"
    :integration-name="integrationName"
    :integration-info="integrationInfo"
    :source="source"
  />
</template>
