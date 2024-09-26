<script lang="ts" setup>
import {
  Alert,
  Icon,
  PriceInputs as PriceInput,
  Buttons as SpButton,
  Inputs as SpInput,
  Select as SpSelect,
  Toggles,
} from '@storipress/core-component'
import type { IMembersSetupState } from '../definition'
import { SetupStep, SymbolMembersSetupState } from '../definition'
import { currencies } from './currencies'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import {
  GetBillingDocument,
  GetSiteDocument,
  SubscriptionSetup,
  UpdateSubscriptionDocument,
} from '~/graphql-operations'
import { useMutation } from '~/lib/apollo'
import { useUserSubscription } from '~/composables'

const emit = defineEmits<{
  (event: 'updateStep', step: SetupStep): void
  (event: 'error'): void
}>()
const { onDone, onError, mutate } = useMutation(UpdateSubscriptionDocument)
const { onDone: onGetBillingDone, mutate: mutateGetBilling } = useMutation(GetBillingDocument)
const { result } = useQuery(GetSiteDocument)

const state = inject<IMembersSetupState>(SymbolMembersSetupState) as IMembersSetupState

onMounted(() => {
  mutateGetBilling()
})

const { onTrialFree } = useUserSubscription()
const subscribed = ref(false)
onGetBillingDone(({ data }) => {
  subscribed.value = Boolean(data?.billing.subscribed)
})

watch(result, (value) => {
  if (value?.site?.email) state.email = value?.site?.email
})

const buttonValidate = computed(() => {
  return !state.offerPaidSubscriptions || (state.monthlyPrice && state.yearlyPrice && state.email)
})

const syncCurrency = computed({
  get() {
    return { name: state.currency }
  },
  set(currency) {
    return (state.currency = currency.name)
  },
})

function onContinue() {
  const input = state.offerPaidSubscriptions
    ? {
        subscription: state.offerPaidSubscriptions,
        newsletter: state.emailNewsletters,
        email: state.email,
        currency: state.currency,
        monthly_price: state.monthlyPrice,
        yearly_price: state.yearlyPrice,
      }
    : {
        subscription: state.offerPaidSubscriptions,
        newsletter: state.emailNewsletters,
        email: state.email,
      }
  mutate({
    input,
  })
}

onDone(({ data }) => {
  switch (data?.updateSubscription?.subscription_setup) {
    case SubscriptionSetup.WaitConnectStripe:
      return emit('updateStep', SetupStep.Stripe)
    case SubscriptionSetup.WaitImport:
      return emit('updateStep', SetupStep.Import)
    default:
      return null
  }
})
onError(() => {
  emit('error')
})

const [confirmDeleteUser] = useConfirmFunction([
  {
    type: 'info',
    title: 'Remove paid subscriptions',
    description: 'This will convert all paywalled articles to login-required articles.',
    okText: 'Confirm',
  },
])

async function updateOfferPaid(value: boolean) {
  if (value) {
    state.offerPaidSubscriptions = value
    return
  }

  const confirmCancel = await confirmDeleteUser()
  if (confirmCancel) state.offerPaidSubscriptions = value
}
</script>

<template>
  <div class="flex w-96 flex-col gap-6">
    <Alert
      v-if="!onTrialFree && !subscribed"
      type="warning"
      message="Upgrade to offer paid subscriptions"
      description="To upgrade your account, go to your account settings."
    />
    <div class="flex items-center">
      <div :class="{ 'opacity-50': !onTrialFree && !subscribed }">
        <p class="text-heading text-stone-800">Offer paid subscriptions</p>
        <p class="text-body text-stone-500">We will prompt you to connect Stripe in the next step.</p>
      </div>
      <Toggles
        type="simple"
        :disabled="!onTrialFree && !subscribed"
        :model-value="state.offerPaidSubscriptions"
        @update:model-value="updateOfferPaid"
      />
    </div>
    <div class="flex items-center">
      <div>
        <p class="text-heading text-stone-800">Email Newsletters</p>
        <p class="text-body text-stone-500">
          Send an email to subscribers whenever a post matching their access level is published.
        </p>
      </div>
      <Toggles v-model="state.emailNewsletters" type="simple" />
    </div>
    <hr class="h-px bg-stone-200" />
    <SpInput
      v-model="state.email"
      label="Support Email"
      placeholder="support@storipress.com"
      html-name="email"
      autocomplete="email"
    />
    <template v-if="state.offerPaidSubscriptions">
      <SpSelect v-model="syncCurrency" label="Plan currency" :items="currencies" option-label-prop="name" />
      <div class="flex gap-4">
        <PriceInput
          v-model="state.monthlyPrice"
          label="Monthly price"
          placeholder="0"
          input-id="monthly_price"
          prefix="$"
          :suffix="`${state.currency}/month`"
        />
        <PriceInput
          v-model="state.yearlyPrice"
          label="Yearly price"
          placeholder="0"
          input-id="yearly_price"
          prefix="$"
          :suffix="`${state.currency}/year`"
        />
      </div>
    </template>

    <div class="flex-1" />
    <SpButton
      class="h-11"
      is-shadow
      default="Button"
      type="main"
      color="primary"
      :disabled="!buttonValidate"
      @click="onContinue"
    >
      Save and continue
      <icon icon-name="arrow_right" icon-right />
    </SpButton>
  </div>
</template>
