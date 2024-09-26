import type { Stripe, StripeElements } from '@stripe/stripe-js'
import delay from 'delay'
import { noop } from 'lodash-es'
import invariant from 'tiny-invariant'
import { useNotification } from '~/composables'
import { CreateTrialAppSubscriptionDocument } from '~/graphql-operations'

export function onBeforeLeave(action_: () => void) {
  let action = action_

  useEventListener(window, 'beforeunload', () => {
    action()
  })

  onBeforeRouteLeave(() => {
    action()
  })

  return () => {
    action = noop
  }
}

export function useTrialCheckout({
  stripe,
  elements,
  fullName,
}: {
  stripe: Ref<Stripe | undefined>
  elements: Ref<StripeElements | undefined>
  fullName: Ref<string>
}) {
  const { create: notifications } = useNotification()
  const { mutate: createTrial } = useMutation(CreateTrialAppSubscriptionDocument)

  function showCardDeclined() {
    sendTrack('trial_payment_card_declined')
    notifications({
      title: 'Payment details incorrect',
      type: 'warning',
      iconName: 'warning',
      content: 'Your payment method is invalid. Please update your card.',
    })
  }

  function showErrorNotifications() {
    sendTrack('trial_payment_failed')
    notifications({
      title: 'Error',
      type: 'warning',
      iconName: 'warning',
      content: 'An error occurred. Try again later.',
    })
  }

  async function confirmPaymentMethod() {
    invariant(stripe.value, 'stripe is not initialized')
    invariant(elements.value, 'elements is not initialized')
    const { setupIntent, error } = await stripe.value.confirmSetup({
      elements: elements.value,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: {
            name: fullName.value,
          },
        },
      },
    })

    if (error || setupIntent?.status !== 'succeeded') {
      showCardDeclined()
      return false
    }
    return setupIntent.payment_method as string
  }

  async function _subscribeTrial() {
    try {
      const trialResult = await createTrial()
      if (!trialResult?.data?.createTrialAppSubscription) {
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

  const { execute: subscribeTrial, isLoading: loadingCreateTrial } = useAsyncState(_subscribeTrial, false, {
    immediate: false,
    throwError: true,
  })

  return {
    showCardDeclined,
    showErrorNotifications,
    confirmPaymentMethod,
    subscribeTrial,
    loadingCreateTrial,
  }
}
