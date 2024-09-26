<script setup lang="ts">
import AnalyticsSvg from '@assets/icons-google-analytics.svg'
import AnalyticsModal from './AnalyticsModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration } from '~/composables'

defineProps<{ integrationName: string; integrationInfo: string }>()

const { visible, integrationData, isActivated, onActivate, onDeactivate, onUpdate, onSwitch } = useIntegration(
  Integrations.GoogleAnalytics,
)
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="AnalyticsSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <AnalyticsModal
    v-model="visible"
    v-model:integration-data="integrationData"
    :label="integrationName"
    :info="integrationInfo"
    :img="AnalyticsSvg"
    :is-activated="isActivated"
    @activate="onActivate"
    @deactivate="onDeactivate"
    @update="onUpdate"
  />
</template>
