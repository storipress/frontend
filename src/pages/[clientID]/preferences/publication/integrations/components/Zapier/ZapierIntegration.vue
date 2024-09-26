<script setup lang="ts">
import ZapierSvg from '@assets/icons-zapier.svg'
import ZapierModal from './ZapierModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration } from '~/composables'

defineProps<{ integrationName: string; integrationInfo: string }>()

const { visible, isActivated, onActivate, onDeactivate, onSwitch } = useIntegration(Integrations.Zapier)
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="ZapierSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <ZapierModal
    v-model="visible"
    :label="integrationName"
    :info="integrationInfo"
    :img="ZapierSvg"
    :is-activated="isActivated"
    @activate="onActivate"
    @deactivate="onDeactivate"
  />
</template>
