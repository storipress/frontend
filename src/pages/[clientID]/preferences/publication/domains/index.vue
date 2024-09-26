<script lang="ts" setup>
import { LoadingSpinner } from '@storipress/core-component'
import { CustomDomain, ThirdPartyCustomDomain, ThirdPartyCustomEmail, useThirdPartyCustomDomain } from './components'
import { GetSiteDocument } from '~/graphql-operations'
import type { GetSiteQuery } from '~/graphql-operations'
import { useWorkspaceStore } from '~/stores/workspace'
import { useNoPermissionRedirect } from '~/composables'
import { HelpButton, HelpCategories } from '~/components/HelpButton'

const route = useRoute()
useNoPermissionRedirect('canAccessDomains', () => `/${route.params.clientID}/preferences/publication/details`)

const workspaceStore = useWorkspaceStore()

useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Publication details - Storipress`),
})

const { result } = useQuery(GetSiteDocument)
const site = computed(() => result.value?.site ?? ({} as GetSiteQuery['site']))

const { isReady, connectedTarget } = useThirdPartyCustomDomain()
</script>

<template>
  <Section title="Domains" class="w-full">
    <div v-if="!isReady" class="flex h-1/2 items-center justify-center">
      <LoadingSpinner show spin-width="w-8" />
    </div>

    <template v-else>
      <template v-if="connectedTarget">
        <SectionContent
          sub-title="Custom domain"
          content="Connect a custom domain following the instructions to the right."
          class="border-b border-stone-200"
        >
          <template #content>
            <ThirdPartyCustomDomain :target="connectedTarget" />
          </template>
        </SectionContent>

        <SectionContent
          sub-title="Send emails from your domain"
          content="Add these records to your DNS to send emails to your subscribers from your domain."
        >
          <template #content>
            <ThirdPartyCustomEmail />
          </template>
        </SectionContent>
      </template>

      <template v-else>
        <SectionContent
          sub-title="Custom Email Domain"
          content="To send emails from a custom address, enter your domain name and add the following DNS records:"
        >
          <template #title>
            Custom domain & email
            <HelpButton :to="HelpCategories.GettingStarted.CustomDomain" />
          </template>
          <template #content>
            <CustomDomain :site="site" />
          </template>
        </SectionContent>
      </template>
    </template>
  </Section>
</template>
