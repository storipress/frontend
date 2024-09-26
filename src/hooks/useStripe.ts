import type { Stripe, StripeElements } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { whenever } from '@vueuse/core'
import { captureException } from '@sentry/vue'
import { useMutation } from '~/lib/apollo'
import { RequestAppSetupIntentDocument } from '~/graphql-operations'
import { env } from '~/env'
import { useNotification } from '~/composables'

interface UseStripeOption {
  focus?: boolean
}

export function useStripe(option?: UseStripeOption) {
  const { focus = true } = option ?? {}

  const reference = ref()
  const elements = shallowRef<StripeElements>()
  const error = ref()
  const loading = ref(true)
  const dataFilled = ref(false)

  const { create: notifications } = useNotification()

  const createPaymentElement = (stripe: Stripe, clientSecret: string) => {
    elements.value = stripe.elements({
      clientSecret,
      locale: 'en',
    })
    const payment = elements.value.create('payment')
    payment.on('ready', () => {
      loading.value = false
      if (focus) payment.focus()
    })
    payment.on('loaderror', ({ error }) => {
      notifications({
        title: error?.message ?? 'Problem encountered loading Stripe',
        type: 'warning',
        iconName: 'warning',
        ...(!error?.message && {
          content:
            'Please refresh the page and try again. If the issue continues, feel free to reach out to our customer support for assistance.',
        }),
      })

      captureException(new Error('fail to load stripe element'), (scope) => {
        scope.setTag('scope', 'payment')
        scope.setContext('stripeError', error as unknown as Record<string, unknown>)
        return scope
      })
    })
    payment.on('change', ({ complete }: { complete: boolean }) => {
      dataFilled.value = complete
    })
    whenever(reference, (reference) => payment.mount(reference), { immediate: true })
  }

  const { onDone, onError, mutate } = useMutation(RequestAppSetupIntentDocument)
  const stripe = shallowRef<Stripe>()
  onMounted(() => {
    mutate()
  })

  onDone(async ({ data }) => {
    if (!data) return

    stripe.value = (await loadStripe(env.VITE_STRIPE_PUBLISHABLEKEY)) as Stripe
    createPaymentElement(stripe.value, data.requestAppSetupIntent)
  })

  onError(() => {
    error.value = 'Failed to Request App Setup Intent'
  })

  return {
    loading,
    stripe,
    elements,
    reference,
    error,
    dataFilled,
    requestAppSetupIntent: mutate,
  }
}
