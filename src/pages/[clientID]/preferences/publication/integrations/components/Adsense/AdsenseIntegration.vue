<script setup lang="ts">
import AdsenseSvg from '@assets/icons-adsense.svg'
import AdsenseModal from './AdsenseModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration } from '~/composables'

defineProps<{ integrationName: string; integrationInfo: string }>()

const { visible, integrationData, isActivated, onActivate, onDeactivate, onUpdate, onSwitch } = useIntegration(
  Integrations.GoogleAdsense,
)
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="AdsenseSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <AdsenseModal
    v-model="visible"
    v-model:integration-data="integrationData"
    :label="integrationName"
    :info="integrationInfo"
    :img="AdsenseSvg"
    :is-activated="isActivated"
    @activate="onActivate"
    @deactivate="onDeactivate"
    @update="onUpdate"
  />
</template>
