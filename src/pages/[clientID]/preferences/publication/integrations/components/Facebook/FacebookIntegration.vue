<script setup lang="ts">
import FacebookSvg from '@assets/icons-facebook.svg'
import { captureException } from '@sentry/vue'
import FacebookModal from './FacebookModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, useIntegration, useNotification, useSocialConnect, useTutorials } from '~/composables'
import { thirdPartyErrorMessage } from '~/composables/social-connect'
import { DisconnectIntegrationDocument } from '~/graphql-operations'

defineProps<{
  integrationName: string
  integrationInfo: string
}>()

const { visible, integrationData, thirdPartyData, isActivated, onActivate, onDeactivate, onSwitch, getThirdPartyApi } =
  useIntegration(Integrations.Facebook)

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
    await disconnectIntegrationMutate({ key: Integrations.Facebook })
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
  notifications(thirdPartyErrorMessage('facebook'))
}
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="FacebookSvg"
    :enabled="isActivated"
    @on-modal-open="visible = true"
    @on-switch="onSwitch"
  />
  <FacebookModal
    v-model="visible"
    :integration-data="integrationData"
    :label="integrationName"
    :info="integrationInfo"
    :img="FacebookSvg"
    :has-authorized="Boolean(thirdPartyData)"
    @connect="openNewWindow"
    @disconnect="disconnectIntegration"
  />
</template>
