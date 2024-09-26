<script setup lang="ts">
import CodeInjectionSvg from '@assets/icons-code-injection.svg'
import CodeInjectionModal from './CodeInjectionModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration } from '~/composables'

defineProps<{ integrationName: string; integrationInfo: string }>()

const { visible, integrationData, isActivated, onActivate, onDeactivate, onUpdate, onSwitch } = useIntegration(
  Integrations.HeaderFooterCode,
)
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="CodeInjectionSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <CodeInjectionModal
    v-model="visible"
    v-model:integration-data="integrationData"
    :label="integrationName"
    :info="integrationInfo"
    :img="CodeInjectionSvg"
    :is-activated="isActivated"
    @activate="onActivate"
    @deactivate="onDeactivate"
    @update="onUpdate"
  />
</template>
