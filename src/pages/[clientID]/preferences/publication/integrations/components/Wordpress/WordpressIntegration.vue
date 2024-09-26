<script setup lang="ts">
import WordpressSvg from '@assets/icons-wordpress.svg'
import WordpressModal from './WordpressModal.vue'
import { IntegrationCard } from '~/components/Integrations'
import { Integrations, onFromRedirect, useQueryToggle, useTutorials } from '~/composables'
import { usePublicationPermission } from '~/composables/permission/publication'
import { GetWordpressInfoDocument } from '~/graphql-operations'

defineProps<{
  integrationName: string
  integrationInfo: string
}>()

const { value: visible } = useQueryToggle({ key: 'integration', value: Integrations.WordPress })

const { ready, canAccessIntegrations } = usePublicationPermission()
const { setTutorials } = useTutorials()

const { result: wordpressInfoResult } = useQuery(GetWordpressInfoDocument)

const activateStatus = computed(() => wordpressInfoResult.value?.wordPressInfo.activated_at)

// TODO: This doesn't work as backend can't report Wordpress connect status just after setup
onFromRedirect(async () => {
  if (!visible.value) return

  if (!ready.value) {
    await until(ready).toBeTruthy()
  }

  if (!canAccessIntegrations.value) {
    return false
  }

  await setTutorials(['setDomain', 'setCustomiseTheme'])
})

function switchHandler() {
  visible.value = true
}
</script>

<template>
  <IntegrationCard
    :label="integrationName"
    :integration-img="WordpressSvg"
    :enabled="activateStatus"
    @on-modal-open="switchHandler"
    @on-switch="switchHandler"
  />
  <WordpressModal v-model="visible" :label="integrationName" :info="integrationInfo" :img="WordpressSvg" />
</template>
