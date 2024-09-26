<script setup lang="ts">
import HubspotSvg from '@assets/icons-hubspot.svg'
import HubspotModal from './HubspotModal.vue'
import { Integrations, useNotification, useSocialConnect } from '~/composables'
import { thirdPartyErrorMessage } from '~/composables/social-connect'
import {
  ConnectHubSpotDocument,
  DisconnectHubSpotDocument,
  HubSpotAuthorizedDocument,
  HubSpotInfoDocument,
  ListIntegrationsDocument,
} from '~/graphql-operations'
import { useApolloClient } from '~/lib/apollo'
import type { IntegrationSource } from '~/schema/integration'

const props = withDefaults(
  defineProps<{
    integrationName: string
    integrationInfo: string
    source?: IntegrationSource
    modelValue: boolean
  }>(),
  { source: 'settings' },
)

defineEmits<{
  'update:modelValue': [boolean]
}>()

const { client } = useApolloClient()

const visible = useModel(props, 'modelValue')

const { refetch: refetchHubSpotInfo } = useQuery(HubSpotInfoDocument)

const { result: hubSpotAuthorizedResult, refetch: refetchHubSpotAuth } = useQuery(HubSpotAuthorizedDocument)

const hasAuthorized = computed(() => hubSpotAuthorizedResult.value?.hubSpotAuthorized ?? false)

const { mutate: disconnectHubSpot } = useMutation(DisconnectHubSpotDocument, {
  refetchQueries: [ListIntegrationsDocument, HubSpotInfoDocument, HubSpotAuthorizedDocument],
})

const { create } = useNotification()

const url = ref()
const { openNewWindow, closeChannel } = useSocialConnect(
  url,
  async () => {
    await Promise.all([refetchHubSpotAuth(), refetchHubSpotInfo()])

    sendTrack('integration_enabled', {
      source: props.source,
      integration: Integrations.Hubspot,
    })

    create({
      title: 'Integration activated',
      type: 'primary',
      content: 'Changes will go live on your site in 3-5 minutes.',
    })
  },
  () => {
    create(thirdPartyErrorMessage('hubspot'))
  },
  { polling: true },
)

onUnmounted(() => {
  closeChannel()
})

async function onConnect() {
  const result = await client.mutate({
    mutation: ConnectHubSpotDocument,
  })
  url.value = result?.data?.connectHubSpot
  openNewWindow()
}

async function onDisconnect() {
  sendTrack('integration_disabled', {
    source: props.source,
    integration: Integrations.Hubspot,
  })
  await disconnectHubSpot()
}

whenever(visible, () => {
  sendTrack('integration_view', {
    source: props.source,
    integration: Integrations.Hubspot,
  })
})
</script>

<template>
  <HubspotModal
    v-model="visible"
    :label="integrationName"
    :info="integrationInfo"
    :img="HubspotSvg"
    :has-authorized="hasAuthorized"
    @connect="onConnect"
    @disconnect="onDisconnect"
  />
</template>
