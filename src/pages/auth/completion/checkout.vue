<route lang="yaml">
meta:
  layout: auth
</route>

<script setup lang="ts">
import stripeBlurple from '@assets/powered-by-stripe-blurple.svg'
import { useSignupCompletion } from './use-signup-complete'
import Card from '~/components/Auth/Card/Card.vue'
import { CheckoutForm } from '~/components/CheckoutForm'
import { GetBillingDocument, GetMeProfileDocument } from '~/graphql-operations'
import { useWithCurrentQuery } from '~/composables'
import { sendLinkedInConvert } from '~/lib/linkedin-track'
import { env } from '~/env'

defineOptions({
  name: 'FreePlanCheckout',
})

useHead({
  title: 'Checkout - Storipress',
})

const { withQuery } = useWithCurrentQuery()

const router = useRouter()
const { result: meResult, loading: loadingGetMe } = useQuery(GetMeProfileDocument)
const name = reactive({ firstName: '', lastName: '' })
const firstName = computed({
  get: () => name.firstName || (meResult.value?.me?.first_name ?? ''),
  set: (val: string) => (name.firstName = val),
})
const lastName = computed({
  get: () => name.lastName || (meResult.value?.me?.last_name ?? ''),
  set: (val) => (name.lastName = val),
})

const { getIncompleteStep } = useSignupCompletion()
async function onDone() {
  sendTrackUnchecked('onboarding_step_completed', {
    step: 3,
    stepName: 'checkout',
  })
  sendLinkedInConvert(env.VITE_LINKEDIN_CONVERSION_ID_CHECKOUT)
  const incompleteStep = await getIncompleteStep()
  if (incompleteStep) router.replace(incompleteStep)
}

const { result: billingResult, loading: loadingBilling } = useQuery(GetBillingDocument)
onMounted(async () => {
  await until(loadingBilling).toBe(false)
  const subscribed = billingResult.value?.billing.subscribed
  const everSubscribed = billingResult.value?.billing.has_historical_subscriptions
  const url = withQuery('/workspaces')
  if (subscribed || everSubscribed) {
    router.replace(url)
  }
})

const isLoading = computed(() => loadingGetMe.value || loadingBilling.value)
</script>

<template>
  <Card title="Try Storipress for 2 weeks for $3.">
    <template #logo>
      <img :src="stripeBlurple" alt="Stripe Blurple" />
    </template>

    <template #description>
      <p class="text-body text-stone-500">Unlimited seats. Cancel any time. 2 week money back guarantee.</p>
    </template>

    <CheckoutForm v-model:first-name="firstName" v-model:last-name="lastName" :loading="isLoading" @done="onDone" />

    <div class="text-body">
      <div class="mb-2 text-stone-500">
        By proceeding, you agree to our
        <a href="https://storipress.com/legal/terms" target="_blank" rel="noopener noreferrer" class="text-emerald-700">
          Terms and Conditions
        </a>
      </div>
    </div>
  </Card>
</template>
