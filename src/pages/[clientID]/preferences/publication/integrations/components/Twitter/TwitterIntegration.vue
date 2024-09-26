<script setup lang="ts">
import TwitterSvg from '@assets/icons-twitter.svg'
import { captureException } from '@sentry/vue'
import TwitterModal from './TwitterModal.vue'
import { DisconnectIntegrationDocument } from '~/graphql-operations'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration, useNotification, useSocialConnect, useTutorials } from '~/composables'
import { thirdPartyErrorMessage } from '~/composables/social-connect'

defineProps<{
  integrationName: string
  integrationInfo: string
}>()

const { visible, integrationData, thirdPartyData, isActivated, onActivate, onDeactivate, onSwitch, getThirdPartyApi } =
  useIntegration(Integrations.Twitter)

const { create: notifications } = useNotification()
const { setTutorials } = useTutorials()

const url = computed(() => getThirdPartyApi())
const { openNewWindow, closeChannel } = useSocialConnect(url, successCallback, errorCallback)
const { mutate: disconnectIntegrationMutate } = useMutation(DisconnectIntegrationDocument)

onUnmounted(() => {
  closeChannel()
})

async function disconnectIntegration() {
  try {
    await disconnectIntegrationMutate({ key: Integrations.Twitter })
    await onDeactivate()
    visible.value = false
  } catch (error) {
    captureException(error)
    errorCallback()
  }
}

function successCallback() {
  if (thirdPartyData.value) {
    onDeactivate()
  } else {
    onActivate(false)
    setTutorials('setSocialConnect')
  }
}
function errorCallback() {
  notifications(thirdPartyErrorMessage('twitter'))
}
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="TwitterSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <TwitterModal
    v-model="visible"
    :integration-data="integrationData"
    :label="integrationName"
    :info="integrationInfo"
    :img="TwitterSvg"
    :has-authorized="Boolean(thirdPartyData)"
    @connect="openNewWindow"
    @disconnect="disconnectIntegration"
  />
</template>
