<script setup lang="ts">
import { Buttons, Inputs } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import * as Yup from 'yup'
import { captureException } from '@sentry/vue'
import delay from 'delay'
import { onBeforeLeave, useTrialCheckout } from './use-trial-checkout'
import { useStripe } from '~/hooks/useStripe'
import {
  ApplyCouponCodeToAppSubscriptionDocument,
  GetBillingDocument,
  UpdateAppPaymentMethodDocument,
} from '~/graphql-operations'
import { useNotification } from '~/composables'

const props = withDefaults(
  defineProps<{
    firstName: string
    lastName: string
    loading: boolean
    buttonText: string
    couponCode: string
  }>(),
  {
    firstName: '',
    lastName: '',
    loading: false,
    buttonText: 'Next',
    couponCode: '',
  },
)

const emit = defineEmits<{
  (event: 'update:firstName', value: string): void
  (event: 'update:lastName', value: string): void
  (event: 'done'): void
}>()

const firstName = useVModel(props, 'firstName')
const lastName = useVModel(props, 'lastName')
const couponCode = useVModel(props, 'couponCode')

const schema = Yup.object().shape({
  firstName: Yup.string().required().label('First name'),
  lastName: Yup.string().required().label('Last name'),
  couponCode: Yup.string().label('Coupon Code'),
})

const { handleSubmit, setFieldError } = useForm({
  initialValues: {
    firstName: '',
    lastName: '',
  } as Record<string, string>,
  validationSchema: schema,
})

const {
  stripe,
  reference: stripeRef,
  elements,
  loading: loadingStripeElement,
  dataFilled,
  requestAppSetupIntent,
} = useStripe({ focus: false })
const isVerified = computed(() => {
  try {
    schema.validateSync({ firstName: firstName.value, lastName: lastName.value })
    return dataFilled.value
  } catch (error) {
    return false
  }
})

const { mutate: updatePayment, loading: loadingUpdatePayment } = useMutation(UpdateAppPaymentMethodDocument)

const { create: notifications } = useNotification()
const { confirmPaymentMethod, showCardDeclined, showErrorNotifications, loadingCreateTrial, subscribeTrial } =
  useTrialCheckout({
    elements,
    fullName: computed(() => `${firstName.value} ${lastName.value}`),
    notifications,
    stripe,
  })

async function confirmPayment() {
  const confirmResult = await confirmPaymentMethod()

  if (confirmResult === false) {
    return false
  }

  try {
    await updatePayment({ token: confirmResult })
    return true
  } catch (error) {
    captureException(new Error('Fail to add payment on signup', { cause: error }))
  }

  return false
}

const { mutate: applyCouponCode, loading: loadingApplyCouponCode } = useMutation(
  ApplyCouponCodeToAppSubscriptionDocument,
)
const { loading: loadingBilling, refetch: refetchBilling } = useQuery(GetBillingDocument)

async function subscribe() {
  try {
    const trialResult = await subscribeTrial()
    if (!trialResult) {
      // the following situations may result in failed subscription. need to create a new PaymentIntent and update payment
      // e.g. the country was selected as the United States and the payment was created with the wrong zip code
      await requestAppSetupIntent()
      showCardDeclined()
      return false
    }
    // after a successful subscription, there may be a slight delay in updating the subscription status due to server conditions, typically not exceeding 3 seconds
    await delay(3000)
    return true
  } catch (error) {
    showErrorNotifications()
  }
  return false
}

async function addCoupon() {
  if (!props.couponCode) return true

  try {
    const addCouponSuccess = await applyCouponCode({ code: props.couponCode })

    if (addCouponSuccess) {
      notifications({
        title: 'Coupon code added',
        type: 'primary',
        content: 'Discount applied.',
      })
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  } catch (error) {
    setFieldError('couponCode', 'The coupon entered has expired or is invalid')
  }
  return false
}

const loadingFlow = ref(false)
const defuseLeave = onBeforeLeave(() => {
  sendTrack('user_skipped_trial_payment')
})
const onDone = handleSubmit(async () => {
  loadingFlow.value = true
  const billingResult = await refetchBilling()
  const billing = billingResult?.data.billing

  if (!billing) {
    showErrorNotifications()
    return null
  }

  let allDone = false
  if (billing.plan_id) {
    allDone = await addCoupon()
  } else {
    const hasPayment = await confirmPayment()
    const subscribed = hasPayment && (await subscribe())
    allDone = subscribed && (await addCoupon())
  }
  defuseLeave()
  allDone && emit('done')
  loadingFlow.value = false
})

const isLoading = computed(
  () =>
    props.loading ||
    loadingStripeElement.value ||
    loadingFlow.value ||
    loadingUpdatePayment.value ||
    loadingCreateTrial.value ||
    loadingApplyCouponCode.value ||
    loadingBilling.value,
)
</script>

<template>
  <form class="mb-4 flex flex-col gap-y-4" :validation-schema="schema" @submit.prevent>
    <div class="flex gap-x-8">
      <Inputs
        v-model="firstName"
        label="First name"
        placeholder="Jane"
        html-name="firstName"
        html-type="text"
        class="w-full"
      />
      <Inputs
        v-model="lastName"
        label="Last name"
        placeholder="Doe"
        html-name="lastName"
        html-type="text"
        class="w-full"
      />
    </div>

    <Inputs
      v-model="couponCode"
      class="hidden"
      label="Coupon code"
      placeholder="Coupon code"
      html-name="couponCode"
      html-type="text"
    />

    <div ref="stripeRef" class="-mt-1" />

    <Buttons
      type="main"
      color="primary"
      is-shadow
      html-type="submit"
      :disabled="!isVerified"
      :is-loading="isLoading"
      class="mt-6 h-[4.5rem]"
      @click="onDone"
    >
      {{ buttonText }}
    </Buttons>
  </form>
</template>
