<script lang="ts" setup>
import { computed } from 'vue'
import { divide, round, subtract } from 'remeda'
import type { StatsProp } from '@storipress/core-component'
import { Graph, Stats } from '@storipress/core-component'
import MembersTable from './components/MembersTable.vue'
import LeftHandNavPanel from './components/LeftHandNavPanel.vue'
import type {
  SubscriptionGraphsQuery,
  SubscriptionGraphsQueryVariables,
  SubscriptionOverviewQuery,
  SubscriptionOverviewQueryVariables,
} from '~/graphql-operations'
import {
  GetSiteDocument,
  SubscriptionGraphsDocument,
  SubscriptionOverviewDocument,
  SubscriptionSetup,
} from '~/graphql-operations'
import { useQuery } from '~/lib/apollo'
import { useWorkspaceStore } from '~/stores/workspace'
import { addDecimal } from '~/utils'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { useRolePermissions } from '~/hooks/useRedirect'
import { useNotification } from '~/composables'

const props = defineProps<{ clientID: string }>()

const workspaceStore = useWorkspaceStore()

useHead({
  title: computed(() => `${workspaceStore.currentWorkspace?.name ?? ''} - Members - Storipress`),
})

sendTrackUnchecked('member_view')

const router = useRouter()
const { result: siteResult, loading: loadingSite } = useQuery(GetSiteDocument)
const { ready, canSetupMember, canAccessMember } = usePublicationPermission()

useRolePermissions(canAccessMember, `/${props.clientID}/articles/desks/all`, ready)

async function goBack() {
  const backState = router?.options?.history?.state?.back && String(router?.options?.history?.state?.back)
  const useBack = backState && !/\/members/.test(backState)

  if (useBack) {
    router.back()
  } else {
    await router.push({
      name: 'clientID-articles-desks-deskSlug',
      params: {
        clientID: props.clientID,
        deskSlug: 'all',
      },
    })
  }
}

const { create: notifications } = useNotification()

watchEffect(async () => {
  if (!ready.value || loadingSite.value) return

  if (!canAccessMember.value) {
    await goBack()
    return
  }

  const setupDone = siteResult.value?.site.subscription_setup === SubscriptionSetup.Done
  if (setupDone) return

  if (canSetupMember.value) {
    await router.push(`/${props.clientID}/members/setup`)
    return
  }

  notifications({
    title: 'Member page has not been setup.',
    type: 'warning',
    iconName: 'warning',
    content: 'Please wait for the publication owner to complete the setup.',
  })
  goBack()
})

const { result: subscriptionGraphsData, loading: loadingSubscriptionGraphs } = useQuery<
  SubscriptionGraphsQuery,
  SubscriptionGraphsQueryVariables
>(SubscriptionGraphsDocument)
const { result: subscriptionOverviewData } = useQuery<SubscriptionOverviewQuery, SubscriptionOverviewQueryVariables>(
  SubscriptionOverviewDocument,
)

function getPercentageValue(value: number | string | undefined, previousValue: number | string | undefined) {
  if (!value || !previousValue) return 0
  value = Number(value)
  previousValue = Number(previousValue)
  return Math.trunc(((value - previousValue) / previousValue) * 100)
}
function getEmailPercent(sends: number | undefined, value: number | undefined) {
  if (!sends || !value) return 0
  return round(divide(value, sends) * 100, 1)
}

const statsList = computed((): StatsProp[] => {
  const { active_subscribers, email_sends, email_opens, email_clicks, revenue } =
    subscriptionOverviewData.value?.subscriptionOverview?.current ?? {}
  const {
    active_subscribers: previous_active_subscribers,
    email_sends: previous_email_sends,
    email_opens: previous_email_opens,
    email_clicks: previous_email_clicks,
    revenue: previous_revenue,
  } = subscriptionOverviewData.value?.subscriptionOverview?.previous ?? {}

  const emailPercent = {
    opens: {
      current: getEmailPercent(email_sends, email_opens),
      previous: getEmailPercent(previous_email_sends, previous_email_opens),
    },
    clicks: {
      current: getEmailPercent(email_sends, email_clicks),
      previous: getEmailPercent(previous_email_sends, previous_email_clicks),
    },
  }
  const currency = siteResult.value?.site.currency ?? 'US'

  return [
    {
      title: 'Active subscribers this month',
      content: active_subscribers ? String(active_subscribers) : '0',
      percentageValue: getPercentageValue(active_subscribers, previous_active_subscribers),
      afterword: 'last month',
    },
    {
      title: 'Email Open Rate this month',
      content: email_opens ? `${emailPercent.opens.current}%` : '0%',
      percentageValue: Math.round(subtract(emailPercent.opens.current, emailPercent.opens.previous)),
      afterword: '',
    },
    {
      title: 'Email Click Rate this month',
      content: email_clicks ? `${emailPercent.clicks.current}%` : '0%',
      percentageValue: Math.round(subtract(emailPercent.clicks.current, emailPercent.clicks.previous)),
      afterword: '',
    },
    {
      title: 'Revenue this month',
      content: `${currency}$${revenue?.replace(/\B(?=\d{2}$)/, '.') || '0'}`,
      percentageValue: getPercentageValue(revenue, previous_revenue),
      afterword: '',
    },
  ]
})

const subscriptionGraphs = computed(() => {
  const subscriptionGraphs = {
    ...(subscriptionGraphsData.value?.subscriptionGraphs ?? { subscribers: [], revenue: [] }),
  }
  subscriptionGraphs.revenue =
    subscriptionGraphs?.revenue?.map((revenue) => ({
      ...revenue,
      revenue: addDecimal(revenue.revenue),
    })) ?? []
  return subscriptionGraphs
})

const [showDefaultError, showInvalidCSVError, showSubscriptionError] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Warning',
    description: 'Oops... something went wrong. Please reload the page to try again.',
    // okText: 'OK',
    okButtonClass: 'hidden',
    cancelButtonClass: 'hidden',
  },
  {
    type: 'warning',
    title: 'Invalid CSV file',
    description: 'Uploaded CSV is invalid — missing email field.',
    // okText: 'OK',
    okButtonClass: 'hidden',
    cancelButtonClass: 'hidden',
  },
  {
    type: 'warning',
    title: 'Assign/Revoke subscription fail',
    description: 'Uh oh... an error occurred. Please reload the page and try again.',
    // okText: 'OK',
    okButtonClass: 'hidden',
    cancelButtonClass: 'hidden',
  },
])

type ErrorType = 'default' | 'import' | 'subscription'
const errorTypes: Record<ErrorType, () => Promise<boolean>> = {
  default: showDefaultError,
  import: showInvalidCSVError,
  subscription: showSubscriptionError,
}

function showErrorPopup(type: ErrorType = 'default') {
  errorTypes[type]()
}

const isUnmounted = ref(true)
onMounted(() => (isUnmounted.value = false))

const isLoading = computed(() => loadingSite.value || loadingSubscriptionGraphs.value || isUnmounted.value)
</script>

<template>
  <div class="flex">
    <LeftHandNavPanel class="sticky top-14 z-10" />
    <div class="min-h-full flex-1 bg-stone-100 pb-10 pl-4 pr-8 pt-4">
      <Section title="Dashboard">
        <hr class="h-px bg-stone-200" />
        <div class="flex gap-4 py-4">
          <div class="flex w-64 flex-col items-center gap-2">
            <Stats v-for="statsData in statsList" :key="statsData.title" v-bind="statsData" class="w-full flex-1" />
          </div>
          <Graph v-if="!isLoading" v-bind="subscriptionGraphs" class="flex-1" />
          <div v-else class="flex-1 rounded bg-white" />
        </div>
      </Section>
      <MembersTable v-if="siteResult?.site.subscription_setup === SubscriptionSetup.Done" @error="showErrorPopup" />
      <div
        v-else
        class="layer-1 text-medium flex h-40 items-center justify-center rounded-lg border bg-white text-black/25"
      >
        Finish setting up Members and Paywalls.
      </div>
    </div>
  </div>
</template>

<style></style>

<route lang="yaml">
meta:
  layout: home-layout
  searchInputType: Members # Article | Member | Schedule
  searchPlaceholder: Search members…
</route>
