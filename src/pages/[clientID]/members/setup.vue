<script lang="ts" setup>
import { provide, ref } from 'vue'
import { Icon, Snackbar } from '@storipress/core-component'
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
import { UserDialog } from '@builder-component'
import { withHttps } from 'ufo'
import type { IMembersSetupState } from './components/definition'
import { SetupStep, SymbolMembersSetupState } from './components/definition'
import { currencies } from './components/Setting/currencies'
import PreviewIframe from './components/PreviewIframe.vue'
import Default from './components/Setting/Default.vue'
import Stripe from './components/Setting/Stripe.vue'
import Import from './components/Setting/Import.vue'
import Confirmation from './components/Setting/Confirmation.vue'
import { GetSiteDocument, SubscriptionSetup } from '~/graphql-operations'
import { useQuery } from '~/lib/apollo'
import { useWorkspaceStore } from '~/stores/workspace'
import { useRolePermissions } from '~/hooks/useRedirect'
import { usePublicationPermission } from '~/composables/permission/publication'

const workspaceStore = useWorkspaceStore()
const route = useRoute()

const { ready, canSetupMember } = usePublicationPermission()
useRolePermissions(canSetupMember, route.fullPath.replace('/setup', ''), ready)

useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Members - Storipress`),
})

sendTrackUnchecked('member_setup_view')

const { result, loading, refetch } = useQuery(GetSiteDocument)

const previewUrl = computed(() => withHttps(result.value?.site?.customer_site_storipress_url ?? ''))

const currentStep = ref<SetupStep>()
function updateStep(step: SetupStep) {
  currentStep.value = step
}

const showWarning = ref(false)
function onError() {
  showWarning.value = true
}

const setpComponents = {
  [SetupStep.Default]: {
    component: Default,
    title: 'Set up subscriptions',
    subtitle: 'Step 1 of 3',
  },
  [SetupStep.Stripe]: {
    component: Stripe,
    title: 'Connect to Stripe',
    subtitle: 'Step 2 of 3',
  },
  [SetupStep.Import]: {
    component: Import,
    title: 'Import your mailing list',
    subtitle: 'Step 3 of 3',
  },
  [SetupStep.Confirmation]: {
    component: Confirmation,
    title: 'Launch your Subscription',
    subtitle: 'CONFIRMATION',
  },
}

const currentComponent = computed(() => {
  if (currentStep.value) {
    return setpComponents[currentStep.value].component
  }
  switch (result.value?.site?.subscription_setup) {
    case SubscriptionSetup.None:
    case SubscriptionSetup.Done:
      updateStep(SetupStep.Default)
      return Default
    case SubscriptionSetup.WaitConnectStripe:
      updateStep(SetupStep.Stripe)
      return Stripe
    case SubscriptionSetup.WaitImport:
      updateStep(SetupStep.Import)
      return Import
    default:
      return Default
  }
})
const router = useRouter()

// it is hack method, ref:https://stackoverflow.com/a/70965943
async function goBack() {
  await refetch()
  await until(loading).not.toBeTruthy()

  const noDone = result.value?.site.subscription_setup !== SubscriptionSetup.Done
  const useBack = !/\/members/.test(`${router?.options?.history?.state?.back}`) && noDone
  const backUrl = noDone ? `/${route.params.clientID}` : `/${route.params.clientID}/members`

  return useBack ? router.back() : router.push(backUrl)
}
async function onDone() {
  await refetch()
  sendTrackUnchecked('tenant_member_subscription_enabled')
  router.push(router.currentRoute.value.fullPath.replace(/\/setup.*$/, ''))
}

const membersSetupState = reactive<IMembersSetupState>({
  offerPaidSubscriptions: false,
  emailNewsletters: true,
  email: '',
  currency: currencies[0].name,
  monthlyPrice: '',
  yearlyPrice: '',
})
provide(SymbolMembersSetupState, membersSetupState)
watch(result, () => {
  membersSetupState.offerPaidSubscriptions = Boolean(result.value?.site?.subscription)
  membersSetupState.emailNewsletters = Boolean(result.value?.site?.newsletter)
  membersSetupState.email = result.value?.site?.email || ''
  membersSetupState.currency = result.value?.site?.currency || ''
  membersSetupState.monthlyPrice = result.value?.site?.monthly_price || ''
  membersSetupState.yearlyPrice = result.value?.site?.yearly_price || ''
})

const siteData = computed(() => {
  const publicationName = workspaceStore.currentWorkspace?.name
  const isVerified =
    membersSetupState.offerPaidSubscriptions && membersSetupState.monthlyPrice && membersSetupState.yearlyPrice
  if (!isVerified) {
    return {
      name: publicationName,
      subscription: false,
    }
  }

  return {
    name: publicationName,
    subscription: true,
    monthly_price: membersSetupState.monthlyPrice,
    yearly_price: membersSetupState.yearlyPrice,
  }
})
</script>

<template>
  <div class="flex size-full bg-stone-100">
    <button
      v-if="!loading"
      class="absolute right-12 top-6 z-10 inline-flex size-12 items-center justify-center rounded-full outline-none hover:bg-stone-200"
      type="button"
      @click="goBack"
    >
      <Icon class="text-[1rem] text-[#4c4c4c]" icon-name="cross_thin" />
    </button>
    <div class="flex min-h-full flex-1 flex-col px-12 pb-8 pt-6">
      <p class="text-subheading text-stone-400">{{ setpComponents[currentStep || SetupStep.Default].subtitle }}</p>
      <Section :title="setpComponents[currentStep || SetupStep.Default].title" class="flex flex-1 flex-col">
        <hr class="mb-4 h-px bg-stone-200" />
        <div class="flex flex-1 items-stretch gap-20">
          <component :is="currentComponent" class="mt-4" @update-step="updateStep" @error="onError" @done="onDone" />
          <PreviewIframe class="flex-1" :url="previewUrl">
            <UserDialog type="subscribe" :use-slide-over="false" :site-data="siteData" :logo="spLogo" />
          </PreviewIframe>
        </div>
      </Section>
    </div>
    <Snackbar
      v-if="showWarning"
      icon="warning"
      title="A server error occurred. Please refresh and retry and contact hello@storipress.com if the issue recurs."
      type="warning"
      button-text=" "
      button-icon="cross_thin"
      @button-click="showWarning = false"
    />
  </div>
</template>

<style></style>

<route lang="yaml">
meta:
  transition: settings
</route>
