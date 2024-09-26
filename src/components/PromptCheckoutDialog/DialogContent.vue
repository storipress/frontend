<script lang="ts" setup>
import backgroundImage from '@assets/mesh-gradient.png'
import PlansForm from './PlansForm.vue'
import AddressForm from './AddressForm.vue'
import { useStripe } from '~/hooks/useStripe'
import {
  ApplyCouponCodeToAppSubscriptionDocument,
  CreateAppSubscriptionDocument,
  GetAppSubscriptionPlansDocument,
  SwapAppSubscriptionDocument,
  UpdateAppPaymentMethodDocument,
} from '~/graphql-operations'
import { useWorkspaceStore } from '~/stores/workspace'
import { PlanStatus, useCheckoutDialog } from '~/hooks/useCheckoutDialog'
import { useNotification } from '~/composables'

withDefaults(defineProps<{ open?: boolean }>(), {
  open: false,
})

const emit = defineEmits<(event: 'done') => void>()

const { billing, refetchBilling, checkoutMode, planStatus, checkoutFrom } = useCheckoutDialog()
const defaultSeats = computed(() => (checkoutMode.value === 'standard' ? 2 : billing.value?.seats_in_use || 1))

const workspaceStore = useWorkspaceStore()

enum Step {
  PlansForm = 'PlansForm',
  AddressForm = 'AddressForm',
}
const currentStep = ref<Step>(Step.PlansForm)
const containerRef = ref<HTMLElement>()
const containerHeight = ref(0)

watch(currentStep, (nextStep) => {
  containerHeight.value = 0
  if (nextStep === Step.AddressForm) {
    containerHeight.value = containerRef.value?.clientHeight ?? 0
  }
})

const { result: subscriptionPlans, loading: loadingGetPlans } = useQuery(GetAppSubscriptionPlansDocument)

const selectedId = ref('')

const { stripe, reference, elements, loading: loadingStripe, error: stripeError } = useStripe()
const formData = reactive({
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postcode: '',
  couponCode: '',
})

const stripeState = reactive({
  loading: false,
  error: false,
})

const { mutate: updateAppPaymentMethod, loading: loadingUpdatePaymentMethod } =
  useMutation(UpdateAppPaymentMethodDocument)
const { mutate: createSubscriptionMutate, loading: loadingCreateAppSubscription } =
  useMutation(CreateAppSubscriptionDocument)
const { mutate: swapSubscriptionMutate, loading: loadingSwapAppSubscription } = useMutation(SwapAppSubscriptionDocument)

async function confirmPayment() {
  if (billing.value?.plan_id) {
    const allDone = await addCoupon()
    allDone && emit('done')
    return
  }

  stripeState.loading = true
  stripeState.error = false

  const { setupIntent, error } =
    (await stripe.value?.confirmSetup({
      elements: elements.value,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: {
              line1: formData.addressLine1,
              line2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postcode,
            },
          },
        },
      },
    })) || {}

  stripeState.loading = false

  if (error || setupIntent?.status !== 'succeeded') {
    stripeState.error = true
    currentStep.value = Step.PlansForm
    return
  }

  try {
    await updateAppPaymentMethod({ token: setupIntent.payment_method as string })

    const mutateSubscription =
      planStatus.value === PlanStatus.Subscribed ? swapSubscriptionMutate : createSubscriptionMutate
    await mutateSubscription({
      input: { price_id: selectedId.value, quantity: defaultSeats.value },
    })

    const allDone = await addCoupon()
    allDone && emit('done')
    await refetchBilling()
  } catch (error) {
    stripeState.error = true
  }
}

const { create: notifications } = useNotification()
const { mutate: applyCouponCode, loading: loadingApplyCouponCode } = useMutation(
  ApplyCouponCodeToAppSubscriptionDocument,
)
async function addCoupon() {
  if (!formData.couponCode) return true

  try {
    const addCouponSuccess = await applyCouponCode({ code: formData.couponCode })

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
    notifications({
      title: 'Invalid coupon code',
      type: 'warning',
      iconName: 'warning',
      content: 'Expired or invalid coupon',
    })
  }
  return false
}

const isLoading = computed(
  () =>
    loadingGetPlans.value ||
    loadingStripe.value ||
    stripeState.loading ||
    loadingCreateAppSubscription.value ||
    loadingUpdatePaymentMethod.value ||
    loadingSwapAppSubscription.value ||
    loadingApplyCouponCode.value,
)
</script>

<template>
  <div
    ref="containerRef"
    class="flex min-h-[37.625rem] w-[50rem]"
    :style="{ height: containerHeight ? `${containerHeight}px` : 'auto' }"
  >
    <div class="w-1/2 rounded-l-lg bg-cover bg-center p-8" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <h1 class="text-display-x-large mb-4 text-white">Experience Storipress' Plus and Standard Plans.</h1>
      <p class="text-heading text-stone-200">
        {{
          checkoutFrom === 'shopify'
            ? 'Upgrade your account to connect Shopify'
            : 'Upgrade your account to invite more Editors and Admins'
        }}
        to
        {{ workspaceStore.currentWorkspace?.name ?? 'Storipress' }}.
      </p>
    </div>
    <div class="flex w-1/2 flex-col p-8 pb-4">
      <PlansForm
        v-show="currentStep === Step.PlansForm"
        v-model="selectedId"
        :seats="defaultSeats"
        :loading="isLoading"
        :subscription-plans="subscriptionPlans"
        :error="stripeError || stripeState.error"
        class="flex-1"
        @next="currentStep = Step.AddressForm"
      >
        <div ref="reference" />
      </PlansForm>
      <AddressForm
        v-show="currentStep === Step.AddressForm"
        v-model="formData"
        :loading="isLoading"
        class="flex-1"
        @verified="confirmPayment"
      />
    </div>
  </div>
</template>
