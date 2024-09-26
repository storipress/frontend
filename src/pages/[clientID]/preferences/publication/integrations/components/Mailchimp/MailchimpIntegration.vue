<script setup lang="ts">
import MailchimpSvg from '@assets/icons-mailchimp.svg'
import MailchimpModal from './MailchimpModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration } from '~/composables'

defineProps<{ integrationName: string; integrationInfo: string }>()

const { visible, integrationData, isActivated, onActivate, onDeactivate, onUpdate, onSwitch } = useIntegration(
  Integrations.Mailchimp,
)
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="MailchimpSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <MailchimpModal
    v-model="visible"
    v-model:integration-data="integrationData"
    :label="integrationName"
    :info="integrationInfo"
    :img="MailchimpSvg"
    :is-activated="isActivated"
    @activate="onActivate"
    @deactivate="onDeactivate"
    @update="onUpdate"
  />
</template>
