<script setup lang="ts">
import DisqusSvg from '@assets/icons-disqus.svg'
import DisqusModal from './DisqusModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration } from '~/composables'

defineProps<{ integrationName: string; integrationInfo: string }>()

const { visible, integrationData, isActivated, onActivate, onDeactivate, onUpdate, onSwitch } = useIntegration(
  Integrations.Disqus,
)
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="DisqusSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <DisqusModal
    v-model="visible"
    v-model:integration-data="integrationData"
    :label="integrationName"
    :info="integrationInfo"
    :img="DisqusSvg"
    :is-activated="isActivated"
    @activate="onActivate"
    @deactivate="onDeactivate"
    @update="onUpdate"
  />
</template>
