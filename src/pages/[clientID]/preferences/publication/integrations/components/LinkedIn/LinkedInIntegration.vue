<script setup lang="ts">
import LinkedInSvg from '@assets/icons-linkedin.svg'
import LinkedInModal from './LinkedInModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration, useNotification, useSocialConnect, useTutorials } from '~/composables'
import { thirdPartyErrorMessage } from '~/composables/social-connect'
import { DisconnectIntegrationDocument, ListIntegrationsDocument } from '~/graphql-operations'
import { useGlobalIntegration } from '~/stores/global-integration'

defineProps<{
  integrationName: string
  integrationInfo: string
}>()

const { visible, configuration, isActivated, onActivate, onDeactivate, onSwitch, getThirdPartyApi } = useIntegration(
  Integrations.LinkedIn,
)

const { create: notifications } = useNotification()
const { setTutorials } = useTutorials()

const { mutate: disconnectIntegration } = useMutation(DisconnectIntegrationDocument, {
  refetchQueries: [ListIntegrationsDocument],
})

const url = computed(() => getThirdPartyApi())
const { openNewWindow, closeChannel } = useSocialConnect(url, successCallback, errorCallback)

onUnmounted(() => {
  closeChannel()
})

const globalIntegration = useGlobalIntegration()
function successCallback() {
  if (configuration.value) {
    onDeactivate()
  } else {
    onActivate(false)
    setTutorials('setSocialConnect')
    globalIntegration.linkedInNotify = true
  }
}
function errorCallback() {
  notifications(thirdPartyErrorMessage('linkedin'))
}

async function onDisconnect() {
  await disconnectIntegration({ key: 'linkedin' })
}
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="LinkedInSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <LinkedInModal
    v-model="visible"
    :integration-data="configuration"
    :label="integrationName"
    :info="integrationInfo"
    :img="LinkedInSvg"
    :has-authorized="Boolean(configuration)"
    @connect="openNewWindow"
    @disconnect="onDisconnect"
  />
</template>
