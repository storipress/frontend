<script setup lang="ts">
import { captureException } from '@sentry/vue'
import { NotificationList, Snackbar } from '@storipress/core-component'
import { ApolloClients } from '@vue/apollo-composable'
import { ConfigProvider } from 'radix-vue'
import ConfirmModalProvider from '~/components/ConfirmModalProvider'
import CustomIntercom from '~/components/CustomIntercom/CustomIntercom.vue'
import Loading from '~/components/Loading/Loading.vue'
import MigratorSplash from '~/components/MigratorSplash.vue'
import { NewArticleProvider } from '~/components/NewArticle'
import PromptCheckoutDialog from '~/components/PromptCheckoutDialog'
import { useListenGlobalEvent, useLoading, useMigratorSplash, useNotification, useShowAPIError } from '~/composables'
import { clients, query } from '~/lib/apollo'
import { useAuthStore } from '~/stores/auth'
import { useMeStore } from '~/stores/me'
import { errorMessage } from './api/error-handler'
import { GetBillingDocument, GetMeDocument, GetSiteDocument } from './graphql-operations'
import IntegrationModalProvider from './IntegrationModalProvider.vue'
import { setUTM } from './lib/analytics'
import { __IS_DEV__ } from './lib/env'
import { updateAttributes, useGrowthBookInit } from './lib/feature-flag'
import { setupIntegrations, startReplaySession } from './lib/integrations'
import { useGlobalIntegration } from './stores/global-integration'

// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Storipress',
})

const isIframe = window.top !== window
const route = useRoute()
const router = useRouter()
const store = useAuthStore()
const { loadingInfo } = useLoading()
const meStore = useMeStore()

const { isEnabled, clientID } = useMigratorSplash()

useGrowthBookInit()

provide(ApolloClients, clients)

onBeforeMount(() => {
  setUTM(route)
})

whenever(
  () => meStore.userIdentification,
  (me) => {
    setupIntegrations(me, route.params.clientID as string)
    if (__IS_DEV__ && me.email !== 'e2e@storipress.com') {
      startReplaySession()
    }
  },
)

const fromClientId = useStorage('from-client-id', '')

const { create } = useNotification()

const { onNotify } = useListenGlobalEvent()

onNotify(({ title, content }) => {
  create({
    type: 'warning',
    iconName: 'warning',
    title,
    content,
  })
})

watch(
  route,
  async (value) => {
    const clientID = value.params.clientID as string
    if (store.clientID !== clientID) {
      if (value.name === 'redirect' || clientID === '_') {
        if (fromClientId.value) {
          store.clientID = fromClientId.value
        }
        return
      }
      store.clientID = clientID
    }

    if (!clientID) return

    if (clientID !== 'default') {
      try {
        const res = await query(clientID, GetSiteDocument, {}, { fetchPolicy: 'cache-first' })
        updateAttributes({
          plan: res.data.site.plan,
        })
      } catch {}
    }

    const billingPathRE = /^\/.+\/account\/billing/
    if (billingPathRE.test(route.path)) return

    try {
      const billingRes = await query(clientID, GetBillingDocument, {}, { fetchPolicy: 'cache-first' })
      const meRes = await query(clientID, GetMeDocument, {}, { fetchPolicy: 'cache-first' })
      const noSubscribed = !billingRes?.data?.billing?.subscribed
      const isOwner = meRes?.data?.me?.role === 'owner'
      if (noSubscribed && isOwner) router.replace('/workspaces')
    } catch (error) {
      captureException(error)
    }
  },
  { immediate: true },
)

const NewArticleProviderComponent = computed(() => {
  const hasClientID = Boolean(route.params.clientID) && route.params.clientID !== '_'
  return hasClientID ? NewArticleProvider : 'div'
})

const globalIntegration = useGlobalIntegration()

const integrationAccess = computed(() => {
  return (globalIntegration.showGlobalIntegration || route.params.clientID) && meStore.userIdentification
})

onMounted(() => {
  errorMessage.value = ''
})
useShowAPIError()
</script>

<template>
  <ConfigProvider>
    <ConfirmModalProvider>
      <component :is="NewArticleProviderComponent">
        <router-view v-slot="{ Component, route: viewRoute }">
          <Transition :name="viewRoute.meta.transition as string">
            <component :is="Component" />
          </Transition>
          <PromptCheckoutDialog v-if="viewRoute.params.clientID" />
        </router-view>
      </component>
    </ConfirmModalProvider>
    <Loading :loading-info="loadingInfo" />
    <CustomIntercom v-if="!isIframe && meStore.userIdentification" />
    <NotificationList />
    <Snackbar
      v-if="errorMessage"
      icon="warning"
      :title="errorMessage"
      type="warning"
      button-text=" "
      button-icon="cross_thin"
      @button-click="errorMessage = ''"
    />
    <MigratorSplash v-if="isEnabled && clientID" :client-id="clientID" />
    <IntegrationModalProvider v-if="!isIframe && integrationAccess" />
  </ConfigProvider>
</template>

<style lang="scss">
.settings {
  &-enter-active {
    @apply duration-300 ease-out will-change-transform;
  }
  &-enter-from {
    @apply translate-y-1/4 transform-gpu opacity-0;
  }
  &-enter-to {
    @apply translate-y-0 transform-gpu opacity-100;
  }
}
</style>
