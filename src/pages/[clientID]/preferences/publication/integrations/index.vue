<script lang="ts" setup>
import { useArrayFilter } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { exclude } from 'tsafe'
import LoadingCard from '~/components/LoadingCard.vue'
import { useIntegrationUtils, useNoPermissionRedirect, useUserSubscription } from '~/composables'
import { useWorkspaceStore } from '~/stores/workspace'
import {
  CodeInjection,
  Disqus,
  Facebook,
  Adsense as GoogleAdsense,
  Analytics as GoogleAnalytics,
  Hubspot,
  LinkedIn,
  Mailchimp,
  Shopify,
  Twitter,
  Webflow,
  Wordpress,
  Zapier,
} from './components'
import Slack from './components/Slack.vue'
import { Integrations, INTEGRATIONS_INFO } from './definition'

defineOptions({
  name: 'PublicationIntegrations',
})

const route = useRoute()
useNoPermissionRedirect('canAccessIntegrations', () => `/${route.params.clientID}/preferences/publication/details`)

const workspaceStore = useWorkspaceStore()
const { resultListIntegration } = useIntegrationUtils()

useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Publication details - Storipress`),
})

const { isPlusPlan, isLifetimePlan } = useUserSubscription()
const enableIntegrations = computed(
  () =>
    new Set(
      [
        Integrations.HeaderFooterCode,
        Integrations.Facebook,
        Integrations.Twitter,
        Integrations.GoogleAnalytics,
        Integrations.Disqus,
        Integrations.Slack,
        Integrations.GoogleAdsense,
        Integrations.LinkedIn,
        Integrations.Shopify,
        Integrations.Zapier,
        Integrations.Webflow,
        (isPlusPlan.value || isLifetimePlan.value) && Integrations.WordPress,
      ].filter(exclude(false)),
    ),
)

const query = useRouteQuery<string | null>('integration', null)
watchEffect(() => {
  const integration = query.value as Integrations
  if (!integration) return

  const integrationsSet = new Set(Object.entries(Integrations).map(([_key, val]) => val))
  if (integrationsSet.has(integration)) return

  query.value = null
})

const integrations = useArrayFilter(
  Object.entries({
    [Integrations.Disqus]: Disqus,
    [Integrations.Facebook]: Facebook,
    [Integrations.GoogleAdsense]: GoogleAdsense,
    [Integrations.GoogleAnalytics]: GoogleAnalytics,
    [Integrations.HeaderFooterCode]: CodeInjection,
    [Integrations.Hubspot]: Hubspot,
    [Integrations.LinkedIn]: LinkedIn,
    [Integrations.Mailchimp]: Mailchimp,
    [Integrations.Shopify]: Shopify,
    [Integrations.Slack]: Slack,
    [Integrations.Twitter]: Twitter,
    [Integrations.Webflow]: Webflow,
    [Integrations.WordPress]: Wordpress,
    [Integrations.Zapier]: Zapier,
  }),
  ([key, _component]) => enableIntegrations.value.has(key as Integrations),
)
</script>

<template>
  <div class="flex flex-col">
    <div class="text-pageheading mb-[1.125rem] text-stone-800">Integrations</div>
    <div class="flex flex-wrap gap-4">
      <template v-if="resultListIntegration?.integrations.length">
        <component
          :is="component"
          v-for="[integrationKey, component] in integrations"
          :key="integrationKey"
          :integration-name="INTEGRATIONS_INFO[integrationKey as Integrations].name"
          :integration-info="INTEGRATIONS_INFO[integrationKey as Integrations].info"
        />
      </template>
      <template v-else>
        <LoadingCard
          v-for="[integrationKey] in integrations"
          :key="integrationKey"
          :width="10 * 16"
          :height="10 * 16"
        />
      </template>
    </div>
  </div>
</template>
