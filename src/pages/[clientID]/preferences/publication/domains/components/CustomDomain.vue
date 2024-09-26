<script setup lang="ts">
import { Alert, Buttons, Icon, Inputs, NOTIFICATION_KEY } from '@storipress/core-component'
import * as Sentry from '@sentry/vue'
import {
  DNS_SETTINGS_MISCONFIGURED,
  DNS_SETTINGS_SUCCESSFUL,
  EMAIL_RECORDS_INCORRECT,
  INCORRECT_HOST_NAME,
} from '../notifications'
import CustomDomainRecordsForm from './CustomDomainRecordsForm.vue'
import LoadingRecords from './LoadingRecords.vue'
import DisconnectModal from './DisconnectModal.vue'
import { Flags, useFeatureFlag } from '~/lib/feature-flag'
import { errorResponse, useCustomDomain, useTutorials, useUserSubscription } from '~/composables'
import type { GetSiteQuery } from '~/graphql-operations'
import { useSiteStore } from '~/stores/site'

const props = defineProps<{
  site: GetSiteQuery['site']
}>()

const {
  customDomain,
  customDomainAvailability,
  customDomainDnsStatus,
  isInvalidDomain,
  status,
  loading,
  checkCustomDomainAvailability,
  getDomainConfiguration,
  checkCustomDomainDnsStatus,
  checkAllCustomDomainDnsStatus,
  checkIncorrectHostWithDNSQuery,
  activateCustomDomain,
  removeCustomDomain,
  parseDomainResult,
} = useCustomDomain()

const enabledPaidCustomDomain = useFeatureFlag(Flags.PaidCustomDomain)
const { onTrialFree } = useUserSubscription()
const plan = ref('free')
const isFreePlan = computed(() => plan.value === 'free')

const notifications = inject(NOTIFICATION_KEY)
const siteStore = useSiteStore()
const { setTutorials } = useTutorials()

checkCustomDomainDnsStatus()

const canGetDomainConfiguration = computed(() => {
  return customDomainAvailability?.mail && customDomainAvailability?.site
})
const domainName = computed({
  get() {
    return customDomain.site
  },
  set(domainName) {
    const result = parseDomainResult(domainName)
    if (result?.isSubDomain && !domainName.startsWith('www.')) {
      Object.assign(customDomain, {
        site: domainName,
        mail: domainName,
        redirect: [],
      })
    } else {
      const { isNakedDomain, nakedDomain, nonNakedDomain } = checkNakedDomain(domainName)

      Object.assign(customDomain, {
        site: domainName,
        mail: nakedDomain,
        redirect: [isNakedDomain ? nonNakedDomain : nakedDomain],
      })
    }
  },
})
const domainRecords = computed(() => {
  const mergeRecords = [
    ...(customDomainDnsStatus.site ?? []),
    ...(customDomainDnsStatus.redirect ?? []),
    ...(customDomainDnsStatus.mail ?? []),
  ]
  return mergeRecords
})
const rootDomain = computed(() => parseDomainResult(customDomainDnsStatus.site[0].domain)?.rootDomain ?? '')

const hasSetupDomain = computed(() => siteStore.site?.mail_domain && siteStore.site?.site_domain)
const hasChanged = computed(() => {
  return Boolean(domainRecords.value.length) && customDomainDnsStatus?.site?.[0]?.domain !== customDomain.site
})
const unavailableForConnect = computed(() => {
  return Boolean(hasSetupDomain.value) || (enabledPaidCustomDomain.value && isFreePlan.value && !onTrialFree.value)
})

const getDomainConfigurationLoading = ref(false)
async function onGetDomainConfiguration() {
  getDomainConfigurationLoading.value = true
  if (hasChanged.value) {
    const removeSuccess = await removeCustomDomain()
    // confirm that has been completely removed before re-initialize
    if (!removeSuccess) {
      Sentry.captureException(new Error('fail to remove custom domain'))
      return
    }
  }
  await getDomainConfiguration()
  getDomainConfigurationLoading.value = false
}

function checkNakedDomain(domain: string) {
  if (domain.startsWith('www.')) {
    return {
      isNakedDomain: false,
      nakedDomain: domain.replace(/^(www\.)/, ''),
    }
  } else {
    return {
      isNakedDomain: true,
      nakedDomain: domain,
      nonNakedDomain: `www.${domain}`,
    }
  }
}

function onInput(e: { target: HTMLInputElement }) {
  loading.value = true
  domainName.value = e.target.value
  checkCustomDomainAvailability(domainName.value)
}
async function onConfirmCustomDomain() {
  if (hasSetupDomain.value) {
    return
  }

  await checkCustomDomainDnsStatus()
  checkAllCustomDomainDnsStatus({ site: customDomainDnsStatus.site, mail: customDomainDnsStatus.mail })
  if (!status.all) {
    const isIncorrectHostName = await checkIncorrectHostWithDNSQuery(customDomainDnsStatus.site[0])

    if (status.error.site === errorResponse.notFound && isIncorrectHostName) {
      const { type, domain } = customDomainDnsStatus.site[0]
      notifications?.({
        title: INCORRECT_HOST_NAME.title.replace('__DOMAIN_TYPE__', type),
        type: 'warning',
        iconName: 'warning',
        content: INCORRECT_HOST_NAME.content.replace('__DOMAIN_TYPE__', type).replace('__REPLACE_DOMAIN__', domain),
      })
      return
    }

    notifications?.({
      title: DNS_SETTINGS_MISCONFIGURED.title,
      type: 'warning',
      iconName: 'warning',
      content: DNS_SETTINGS_MISCONFIGURED.content,
    })
  } else if (status.siteDomain && !status.mailDomain) {
    notifications?.({
      title: EMAIL_RECORDS_INCORRECT.title,
      type: 'warning',
      iconName: 'warning',
      content: EMAIL_RECORDS_INCORRECT.content,
    })
  } else {
    const result = await activateCustomDomain()
    if (result) {
      notifications?.({
        title: DNS_SETTINGS_SUCCESSFUL.title,
        type: 'primary',
        content: DNS_SETTINGS_SUCCESSFUL.content,
      })
      setTutorials('setDomain')
    }
    siteStore.fetchSite()
  }
}

const disconnectModalOpen = ref(false)
const isLoading = ref(false)
async function onDisconnect() {
  isLoading.value = true
  const removeSuccess = await removeCustomDomain()
  if (!removeSuccess) {
    Sentry.captureException(new Error('fail to remove custom domain'))
    return
  }
  await checkCustomDomainDnsStatus()
  await siteStore.fetchSite()
  isLoading.value = false
  disconnectModalOpen.value = false
}

watch(
  () => props.site,
  (data) => {
    plan.value = data?.plan ?? 'free'
  },
  { immediate: true },
)
</script>

<template>
  <Alert
    v-if="enabledPaidCustomDomain && isFreePlan && !onTrialFree"
    message="Upgrade account to connect a custom domain."
    type="warning"
    class="mb-8"
  >
    <template #description>
      <span class="text-body text-stone-800">
        Connect a custom domain, collect revenue on members, invite more Admin Editors, connect to Shopify and Webflow,
        and more.
      </span>
    </template>
  </Alert>

  <form @submit.prevent>
    <div class="flex items-end gap-x-2">
      <Inputs
        v-model="domainName"
        label="1. Enter your domain name"
        placeholder="Enter the domain you want to connect"
        html-name="customDomain"
        html-type="text"
        :disabled="unavailableForConnect"
        :show-error="Boolean(domainName)"
        class="w-full"
        @input="onInput"
      />
      <Buttons
        type="main"
        color="primary"
        html-type="submit"
        class="size-9 transition-colors duration-200 ease-in-out"
        :disabled="!canGetDomainConfiguration || isInvalidDomain || (Boolean(domainRecords.length) && !hasChanged)"
        @click="onGetDomainConfiguration"
      >
        <Icon
          icon-name="check"
          class="scale-[.6] rounded-full p-1.5"
          :class="
            !canGetDomainConfiguration || isInvalidDomain || (Boolean(domainRecords.length) && !hasChanged)
              ? 'bg-stone-600 text-stone-200'
              : 'bg-white text-emerald-700'
          "
        />
      </Buttons>
    </div>

    <LoadingRecords v-if="getDomainConfigurationLoading" class="mt-8" />

    <template v-if="Boolean(domainRecords.length) && !hasChanged">
      <LoadingRecords v-if="loading" class="mt-8" />

      <template v-else>
        <CustomDomainRecordsForm :domain-records="domainRecords" :root-domain="rootDomain" class="my-8" />

        <div class="flex gap-x-2">
          <Buttons
            type="main"
            color="primary"
            html-type="submit"
            :disabled="unavailableForConnect"
            class="h-11 w-full"
            @click="onConfirmCustomDomain"
          >
            {{ hasSetupDomain ? `Custom domain Connected` : `Verify DNS Settings` }}
          </Buttons>
          <Buttons
            v-if="hasSetupDomain"
            type="main"
            color="warning"
            html-type="submit"
            class="size-11 text-base transition-colors duration-200 ease-in-out"
            @click="disconnectModalOpen = true"
          >
            <Icon icon-name="link_break" />
          </Buttons>
        </div>
      </template>
    </template>
  </form>

  <DisconnectModal
    title="Disconnect custom domain"
    info="Are you sure you want to disconnect your custom domain? Your site will be immediately inaccessible via this domain."
    :visible="disconnectModalOpen"
    :loading="isLoading"
    @on-modal-close="disconnectModalOpen = false"
    @on-confirm="onDisconnect"
  />
</template>
