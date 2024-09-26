<script setup lang="ts">
import { Buttons, Icon, Inputs, NOTIFICATION_KEY } from '@storipress/core-component'
import * as Sentry from '@sentry/vue'
import { DNS_SETTINGS_MISCONFIGURED, DNS_SETTINGS_SUCCESSFUL, INCORRECT_HOST_NAME } from '../notifications'
import CustomDomainRecordsForm from './CustomDomainRecordsForm.vue'
import LoadingRecords from './LoadingRecords.vue'
import DisconnectModal from './DisconnectModal.vue'
import { errorResponse, useCustomDomain } from '~/composables'
import { useSiteStore } from '~/stores/site'

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
} = useCustomDomain(({ mail }) => mail)
const siteStore = useSiteStore()

const mailDomain = computed(() => siteStore.site?.mail_domain)
const hasChanged = computed(() => {
  return Boolean(customDomainDnsStatus?.mail?.length) && customDomainDnsStatus?.mail?.[0]?.domain !== customDomain.mail
})
const rootDomain = computed(() => parseDomainResult(customDomainDnsStatus.mail[0].domain)?.rootDomain ?? '')

function onInput() {
  loading.value = true
  checkCustomDomainAvailability(customDomain.mail)
}

checkCustomDomainDnsStatus()

const getDomainConfigurationLoading = ref(false)
async function onGetDomainConfiguration() {
  getDomainConfigurationLoading.value = true
  if (hasChanged.value) {
    const removeSuccess = await removeCustomDomain()
    // confirm that has been completely removed before re-initialize
    if (!removeSuccess) return
  }
  await getDomainConfiguration()
  getDomainConfigurationLoading.value = false
}

const notifications = inject(NOTIFICATION_KEY)
async function onConfirmCustomDomain() {
  if (mailDomain.value) {
    return
  }

  await checkCustomDomainDnsStatus()
  checkAllCustomDomainDnsStatus({ mail: customDomainDnsStatus.mail })
  if (!status.all) {
    const isIncorrectHostName = await checkIncorrectHostWithDNSQuery(customDomainDnsStatus.mail[0])

    if (status.error.mail === errorResponse.notFound && isIncorrectHostName) {
      const { type, domain } = customDomainDnsStatus.mail[0]
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
  } else {
    const result = await activateCustomDomain()
    if (result) {
      notifications?.({
        title: DNS_SETTINGS_SUCCESSFUL.title,
        type: 'primary',
        content: DNS_SETTINGS_SUCCESSFUL.content,
      })
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
</script>

<template>
  <form @submit.prevent>
    <div class="flex items-end gap-x-2">
      <Inputs
        v-model="customDomain.mail"
        label="1. Enter your domain name"
        placeholder="Enter the domain you want to connect"
        html-name="customDomain"
        html-type="text"
        :disabled="Boolean(mailDomain)"
        :show-error="Boolean(customDomain.mail)"
        class="w-full"
        @input="onInput"
      />
      <Buttons
        type="main"
        color="primary"
        html-type="submit"
        class="size-9 transition-colors duration-200 ease-in-out"
        :disabled="
          !customDomainAvailability?.mail ||
          isInvalidDomain ||
          (Boolean(customDomainDnsStatus?.mail?.length) && !hasChanged)
        "
        @click="onGetDomainConfiguration"
      >
        <Icon
          icon-name="check"
          class="scale-[.6] rounded-full p-1.5"
          :class="
            !customDomainAvailability?.mail ||
            isInvalidDomain ||
            (Boolean(customDomainDnsStatus?.mail?.length) && !hasChanged)
              ? 'bg-stone-600 text-stone-200'
              : 'bg-white text-emerald-700'
          "
        />
      </Buttons>
    </div>

    <LoadingRecords v-if="getDomainConfigurationLoading" class="mt-8" />

    <template v-if="Boolean(customDomainDnsStatus?.mail?.length) && !hasChanged">
      <LoadingRecords v-if="loading" class="mt-8" />

      <template v-else>
        <CustomDomainRecordsForm :domain-records="customDomainDnsStatus?.mail" :root-domain="rootDomain" class="my-8" />

        <div class="flex gap-x-2">
          <Buttons
            type="main"
            color="primary"
            html-type="submit"
            :disabled="Boolean(mailDomain)"
            class="h-11 w-full"
            @click="onConfirmCustomDomain"
          >
            {{ mailDomain ? `Custom domain Connected` : `Verify DNS Settings` }}
          </Buttons>
          <Buttons
            v-if="Boolean(mailDomain)"
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
    title="Disconnect email domain"
    info="Are you sure you want to disconnect your email domain? Newsletters will immediately be sent from a Storipress branded domain which may impact your deliverability."
    :visible="disconnectModalOpen"
    :loading="isLoading"
    @on-modal-close="disconnectModalOpen = false"
    @on-confirm="onDisconnect"
  />
</template>
