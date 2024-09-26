<script setup lang="ts">
import { Icon, Buttons as SpButton } from '@storipress/core-component'
import { plansDotPoints } from '../definition'
import PlanCard from './components/PlanCard.vue'
import type { Plan } from './components/definitions'
import PlanDetail from './components/PlanDetail.vue'
import { GetAppSubscriptionPlansDocument } from '~/graphql-operations'
import { addDecimal } from '~/utils'
import { useUserSubscription } from '~/composables'

const { result } = useQuery(GetAppSubscriptionPlansDocument)

const router = useRouter()

const { isPlusPlan, ready } = useUserSubscription()

const plans = computed((): Plan[] => {
  const publisherMonthlyPrice =
    result.value?.appSubscriptionPlans?.find(({ group, interval }) => {
      return group === 'publisher' && interval === 'month'
    })?.price || '0'
  const publisherPrice = addDecimal(publisherMonthlyPrice)

  const currency = result.value?.appSubscriptionPlans?.[0]?.currency?.toUpperCase() || 'US'
  return [
    {
      enabled: true,
      title: 'Prophet',
      subtitle: 'Have your content create revenue.',
      price: '',
      buttonText: 'Contact sales',
      contentTitle: 'All the goodness of Workflow',
      list: ['Email collection and tracking.', 'Prophet AI email sending', 'HubSpot integration'],
      onButtonClick: () => window.open('mailto:hello@storipress.com'),
    },
    {
      enabled: !ready.value || !isPlusPlan.value,
      title: 'Storipress Content Workflow',
      subtitle: 'For publishers who need brand and engagement tools.',
      price: `$${currency}${publisherPrice} per seat/mth`,
      buttonText: 'Select Plan',
      contentTitle: '',
      list: plansDotPoints.publisher,
      onButtonClick: () =>
        router.replace(`/${router.currentRoute.value.params.clientID}/account/billing/checkout/publisher`),
    },
  ]
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center gap-4">
      <router-link
        v-slot="{ navigate }"
        :to="`/${router.currentRoute.value.params.clientID}/account/billing`"
        replace
        custom
      >
        <SpButton class="h-9 w-10 shadow-1-layer" @click="navigate">
          <Icon icon-name="arrow_left" />
        </SpButton>
      </router-link>
      <h1 class="text-pageheading">Select a plan</h1>
    </div>

    <div class="flex gap-4">
      <PlanCard v-for="plan in plans" :key="plan.title" v-bind="plan">
        <PlanDetail :plan="plan" />
      </PlanCard>
    </div>
  </div>
</template>
