<script lang="ts" setup>
import SlackSvg from '@assets/icons-slack.svg'
import * as Sentry from '@sentry/vue'
import delay from 'delay'
import type { ChangeType, CompareChannels, SlackChannel, UpdateSlackChannels } from './definition'
import SlackAuthorized from './Authorized.vue'
import { AuthorizationView, BasicDialog } from '~/components/Integrations'
import { Integrations, useIntegration, useIntegrationUtils, useSocialConnect } from '~/composables'
import {
  AddSlackChannelsDocument,
  DeleteSlackChannelsDocument,
  DisconnectIntegrationDocument,
  GetSlackChannelsListDocument,
} from '~/graphql-operations'

const props = withDefaults(defineProps<{ modelValue: boolean; source?: 'editor' | 'settings' }>(), {
  source: 'settings',
})

const emit = defineEmits<(event: 'update:modelValue', val: boolean) => void>()

const slackChannelsList = ref([] as SlackChannel[])

const { getParseData, refetchListIntegration } = useIntegrationUtils()

const {
  visible,
  activatedTime,
  thirdPartyData,
  integrationData,
  onActivate,
  onUpdate,
  onDeactivate,
  getThirdPartyApi,
} = useIntegration(Integrations.Slack, props.source)

const modelValue = useVModel(props, 'modelValue', emit)
syncRef(modelValue, visible)

const { mutate: getSlackChannelsListMutate } = useMutation(GetSlackChannelsListDocument)
const { mutate: disconnectIntegrationMutate } = useMutation(DisconnectIntegrationDocument)
const { mutate: addSlackChannelsMutate } = useMutation(AddSlackChannelsDocument)
const { mutate: deleteSlackChannelsMutate } = useMutation(DeleteSlackChannelsDocument)

async function getSlackChannelsList() {
  await until(thirdPartyData).toBeTruthy()

  try {
    const result = await getSlackChannelsListMutate()
    if (result?.data?.getSlackChannelsList) {
      slackChannelsList.value = result.data.getSlackChannelsList
    }
  } catch (error) {
    Sentry.captureException(error)
  }
}

watchOnce(visible, () => {
  getSlackChannelsList()
})

async function successCallback() {
  await delay(1000)
  await refetchListIntegration()
  await getSlackChannelsList()
}

const url = computed(() => getThirdPartyApi())
const { openNewWindow, closeChannel } = useSocialConnect(url, successCallback)

async function onDisconnectSlack() {
  await disconnectIntegrationMutate({ key: 'slack' })
  onDeactivate()
}
async function addSlackChannels(input: { key: ChangeType; channels: string[] }) {
  if (!input.channels.length) return
  await addSlackChannelsMutate({ input })
}
async function deleteSlackChannels(input: { key: ChangeType; channels: string[] }) {
  if (!input.channels.length) return
  await deleteSlackChannelsMutate({ input })
}

function compareChannels(preChannel: SlackChannel['id'][], newChannel: SlackChannel['id'][]) {
  const result: CompareChannels = {
    add: [],
    del: [],
  }
  const currentChannels = new Set<SlackChannel['id']>(preChannel)

  for (const channel of newChannel) {
    if (!currentChannels.has(channel)) {
      result.add.push(channel)
    } else {
      currentChannels.delete(channel)
    }
  }

  result.del = [...currentChannels]

  return result
}

async function onUpdateSlack() {
  const { stage: preStage, published: prePublished } = getParseData(Integrations.Slack).value
  const { stage: newStage, published: newPublished } = integrationData.value

  const compareResult: UpdateSlackChannels[] = [
    { key: 'stage', channels: compareChannels(preStage ?? [], newStage) },
    { key: 'published', channels: compareChannels(prePublished ?? [], newPublished) },
  ]

  const promises = compareResult.flatMap(({ key, channels: { add, del } }) => [
    addSlackChannels({ key, channels: add }),
    deleteSlackChannels({ key, channels: del }),
  ])

  await Promise.all(promises)
  if (activatedTime.value) {
    onUpdate()
  } else {
    onActivate()
  }
}

onUnmounted(() => {
  closeChannel()
})
</script>

<template>
  <BasicDialog
    v-model="visible"
    :img="SlackSvg"
    integration-name="Slack"
    info="Send Slack messages with article feedback + stage changes"
  >
    <SlackAuthorized
      v-if="Boolean(thirdPartyData)"
      v-model:integration-data="integrationData"
      :integration-img="SlackSvg"
      :channels-list="slackChannelsList"
      @disconnect="onDisconnectSlack"
      @update="onUpdateSlack"
    />
    <AuthorizationView
      v-else
      :integration-img="SlackSvg"
      text="Connect your Slack organization"
      @connect="openNewWindow"
      @back="visible = false"
    />
  </BasicDialog>
</template>
