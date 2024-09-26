<script lang="ts" setup>
import SlackSvg from '@assets/icons-slack.svg'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations as IntegrationsKey, useIntegration } from '~/composables'
import SlackModal from '~/components/SlackModal/SlackModal.vue'

defineProps<{ integrationName: string }>()

const visible = ref(false)

const { thirdPartyData, isActivated, onSwitch } = useIntegration(IntegrationsKey.Slack)

function onSwitchHandler() {
  if (!isActivated.value && !thirdPartyData.value) {
    visible.value = true
  }
  onSwitch(false)
}
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="SlackSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitchHandler"
  />
  <SlackModal v-model="visible" />
</template>
