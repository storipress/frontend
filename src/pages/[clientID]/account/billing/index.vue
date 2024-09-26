<script setup lang="ts">
import { capitalize, cond } from 'lodash-es'
import { HoverHint, Modals as Modal, Buttons as SpButton } from '@storipress/core-component'
import invariant from 'tiny-invariant'
import type { AllPlanGroup, StripePlansGroup, TCardBrands } from '../definition'
import { cardBrands, groupNameMap } from '../definition'
import PaymentModal from './components/PaymentModal.vue'
import CouponCodeModal from './components/CouponCodeModal.vue'
import BillingCycleCard from './components/BillingCycleCard.vue'
import BillingCreditsCard from './components/BillingCreditsCard.vue'
import { dayjs } from '~/lib/dayjs'
import {
  CancelAppSubscriptionDocument,
  GetAppSubscriptionPlansDocument,
  GetBillingDocument,
  ResumeAppSubscriptionDocument,
} from '~/graphql-operations'
import { addDecimal } from '~/utils'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { useMe } from '~/composables/permission/account'

const router = useRouter()

const { result: billingResult, refetch: billingRefetch } = useQuery(GetBillingDocument)
const { result: subscriptionPlansResult } = useQuery(GetAppSubscriptionPlansDocument)

const currentPlanData = computed(() => {
  const currentPlan = subscriptionPlansResult.value?.appSubscriptionPlans?.find(({ group, interval }) => {
    const billingPlan = billingResult.value?.billing?.plan || ''

    const isTrial = billingResult.value?.billing?.interval === 'trial'
    const billingInterval = isTrial ? 'month' : billingResult.value?.billing?.interval

    return group === billingPlan && billingInterval?.includes(interval)
  })

  const defaultData = {
    id: '',
    group: '',
    currency: '',
    price: '',
    interval: '',
    interval_count: 1,
    usage_type: '',
  }

  return currentPlan ?? defaultData
})

// TODO: need to change for AppSumo
const currentPlanText = computed(() => {
  if (billingResult.value?.billing?.interval === 'trial') {
    return 'Standard Trial ($USD3.00 — Unlimited Seats x 1 month)'
  }
  if (!currentPlanData.value) return 'Storipress Plan'
  const { interval, price, group, currency } = currentPlanData.value
  const planPrice = addDecimal(price)
  const groupName = groupNameMap[group as StripePlansGroup] ?? group

  return `${capitalize(groupName)} ${capitalize(
    billingResult.value?.billing?.interval || '',
  )} ($${currency.toUpperCase()}${planPrice}/seat/${interval[0]} x ${
    billingResult.value?.billing?.seats_in_use ?? 0
  } seats)`
})

const isLifetimePlan = computed(() => billingResult.value?.billing.interval === 'lifetime')
const isPlanUpdatable = computed(() => billingResult.value?.billing.plan !== 'prophet')
const isVieDeDingue = computed(() => billingResult.value?.billing.referer === 'viededingue')
const isAppSumo = computed(() => billingResult.value?.billing.source === 'appsumo')
const isProphet = computed(() => billingResult.value?.billing.plan === 'prophet')

const subscribeStatus = computed(() => {
  if (!isLifetimePlan.value) {
    if (billingResult.value?.billing?.on_trial) return 'Trial'
    if (!billingResult.value?.billing?.subscribed) return 'Free'
  }

  if (isProphet.value) {
    return 'Storipress Founders Edition Plan'
  }

  const planName =
    groupNameMap[billingResult.value?.billing?.plan as AllPlanGroup] ?? billingResult.value?.billing?.plan
  return `${planName} ${billingResult.value?.billing?.interval ?? ''}`
})

const subscribeStatusDescription = computed(() => {
  if (isProphet.value) {
    return 'You are on Storipress Founders Edition plan'
  }

  if (isLifetimePlan.value) {
    return 'You are on a lifetime plan'
  }

  switch (subscribeStatus.value) {
    case 'Trial':
      return 'You are on a trial subscription'
    case 'Free':
      return 'You are on the free plan'
    default:
      return 'You are on a paid subscription'
  }
})

const nextBillingDate = computed(
  cond([
    [() => isLifetimePlan.value, () => 'N/A'],
    [() => !billingResult.value?.billing?.next_pm_date, () => '-'],
    [
      () => subscribeStatus.value === 'Trial',
      () =>
        `Your trial has ${dayjs(billingResult.value?.billing.next_pm_date).diff(dayjs(), 'day') + 1} days remaining`,
    ],
    [() => true, () => dayjs(billingResult.value?.billing.next_pm_date).format('DD MMMM YYYY')],
  ]),
)

const isShowCancelButton = computed(
  cond([
    [() => Boolean(billingResult.value?.billing?.canceled), () => false],
    [() => true, () => Boolean(billingResult.value?.billing?.plan)],
  ]),
)

const me = useMe()

const [confirmCancelPlan] = useConfirmFunction(
  computed(() => [
    {
      title: `${me.value?.first_name} before you go…`,
      icon: 'check',
      iconClass: 'text-teal-500',
      iconWarpClass: 'bg-teal-500/[.25]',
      description:
        'By downgrading, you’ll lose access to your custom domain and all team members will be converted to Writer permissions, as well as Premium-only features like multi-publication support.',
      okText: 'Yes, continue',
      okButtonClass: 'bg-teal-500 hover:bg-teal-600',
      cancelText: 'Don’t cancel',
    },
  ]),
)

const { onDone: cancelSubscriptionDone, mutate: CancelSubscriptionMutate } = useMutation(CancelAppSubscriptionDocument)
cancelSubscriptionDone(() => billingRefetch())

const changePlanPath = computed(() =>
  isVieDeDingue.value
    ? 'https://viededingue.com/produits/'
    : isAppSumo.value
      ? `https://appsumo.com/account/redemption/${billingResult.value?.billing.plan_id ?? ''}#change-plan`
      : null,
)
function toExternalChangePlan() {
  invariant(changePlanPath.value, 'No AppSumo path')
  location.href = changePlanPath.value
}

function updatePlan() {
  if (isAppSumo.value) {
    return toExternalChangePlan()
  }
  router.replace(`/${router.currentRoute.value.params.clientID}/account/billing/plans`)
}

async function cancelPlan() {
  if (isAppSumo.value || isVieDeDingue.value) {
    return toExternalChangePlan()
  }
  if (!(await confirmCancelPlan())) return
  CancelSubscriptionMutate()
}

const { onDone: resumeSubscriptionDone, mutate: resumeAppSubscriptionMutate } =
  useMutation(ResumeAppSubscriptionDocument)
resumeSubscriptionDone(() => billingRefetch())

const paymentModalIsOpen = ref(false)
const paymentMethodDescription = computed(() => {
  if (billingResult.value?.billing.has_pm && billingResult.value?.billing.pm_type) {
    return `${cardBrands[billingResult.value?.billing.pm_type as TCardBrands]} ending in ${
      billingResult.value?.billing.pm_last_four
    }`
  }
  return 'No payment method added'
})

const couponModalIsOpen = ref(false)
</script>

<template>
  <Section title="Billing & Earnings" class="flex-1">
    <SectionContent
      sub-title="Plan details"
      content="Manage or change your Storipress plan. View our terms of service and privacy policy."
      class="border-b border-stone-200"
    >
      <div class="layer-1 mt-4 w-[34rem] rounded-lg bg-white">
        <article class="border-b border-stone-200 p-5">
          <h3 class="text-heading mb-[0.625rem] capitalize text-stone-800">
            {{ subscribeStatus }}
          </h3>
          <p class="text-body text-stone-500">{{ subscribeStatusDescription }}</p>
        </article>
        <article class="border-b border-stone-200 p-5">
          <h3 class="text-subheading mb-[0.625rem] text-stone-800">Next billing date</h3>
          <p class="text-body text-stone-800">
            {{ nextBillingDate }}
          </p>
        </article>
        <article class="border-b border-stone-200 p-5">
          <div class="mb-[0.625rem] flex items-center justify-between">
            <h3 class="text-subheading text-stone-800">Payment method</h3>
            <a href="#" class="text-body block text-sky-600" @click.prevent="paymentModalIsOpen = true">
              Update payment method
            </a>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-body text-stone-800">{{ paymentMethodDescription }}</p>
            <a
              v-if="billingResult?.billing?.subscribed"
              href="#"
              class="text-body block text-sky-600"
              @click.prevent="couponModalIsOpen = true"
            >
              Add coupon code
            </a>
          </div>
        </article>
        <div class="p-5 text-right">
          <SpButton
            v-if="isShowCancelButton"
            is-shadow
            class="mr-2 border-red-700 px-4 py-[0.625rem] text-red-700"
            @click="cancelPlan"
          >
            Cancel plan
          </SpButton>
          <HoverHint v-if="isLifetimePlan || !billingResult?.billing?.on_grace_period" :disabled="isPlanUpdatable">
            <template #default>
              <SpButton
                is-shadow
                :disabled="!isPlanUpdatable"
                class="px-4 py-[0.625rem]"
                color="primary"
                @click="updatePlan"
              >
                {{ ['Trial', 'Free'].includes(subscribeStatus) ? 'Choose plan' : 'Update plan' }}
              </SpButton>
            </template>
            <template #content>Please contact customer service</template>
          </HoverHint>
          <SpButton v-else is-shadow class="px-4 py-[0.625rem]" color="primary" @click="resumeAppSubscriptionMutate">
            Resume plan
          </SpButton>
        </div>
      </div>
    </SectionContent>

    <SectionContent
      sub-title="Plan details"
      content="Manage or change your Storipress plan. View our terms of service and privacy policy."
    >
      <div class="w-[34rem]">
        <BillingCycleCard
          :plan="currentPlanText"
          :currency="currentPlanData?.currency"
          :billing="billingResult?.billing"
        />
        <BillingCreditsCard />
      </div>
    </SectionContent>
  </Section>
  <Modal :visible="paymentModalIsOpen" @on-modal-close="paymentModalIsOpen = false">
    <PaymentModal @close="paymentModalIsOpen = false" @updated="billingRefetch" />
  </Modal>
  <Modal :visible="couponModalIsOpen" @on-modal-close="couponModalIsOpen = false">
    <CouponCodeModal @close="couponModalIsOpen = false" @updated="billingRefetch" />
  </Modal>
</template>

<style scoped></style>
