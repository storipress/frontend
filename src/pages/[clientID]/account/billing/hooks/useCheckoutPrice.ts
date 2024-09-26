import type { Ref } from 'vue'
import { Decimal } from 'decimal.js'
import type { PreviewAppSubscriptionInput, PreviewAppSubscriptionMutation } from '~/graphql-operations'
import { GetBillingDocument, GetCreditsOverviewDocument, PreviewAppSubscriptionDocument } from '~/graphql-operations'
import { addDecimal } from '~/utils'

export interface CurrentPlan {
  id: string
  currency: string
  interval: string
  price: string
  title: string
  subTitle: string
  isRecommended: boolean
  savedMoney: string
}

export enum ErrorType {
  CouponCodeError = 1,
  OtherError,
}

export default function useCheckoutPrice(
  currentPlan: Ref<CurrentPlan | undefined>,
  selectedUserLength: Ref<number>,
  couponCode: Ref<string>,
  onError?: (error?: Error, errorType?: ErrorType) => void,
  onPreview?: () => void,
) {
  const { result: billing, refetch: refetchBilling, loading: loadingGetBilling } = useQuery(GetBillingDocument)

  const isSubscribed = computed(() => billing.value?.billing?.subscribed)

  type PreviewAppSubscription = PreviewAppSubscriptionMutation['previewAppSubscription']
  const previewPrice = reactive<Record<string, PreviewAppSubscription | undefined>>({})
  const currentKey = computed<string>(() => `${currentPlan.value?.id}_${selectedUserLength.value}_${couponCode.value}`)
  const { mutate: mutatePreview, loading: loadingPreview } = useMutation(PreviewAppSubscriptionDocument)

  const couponCodeAdded = ref(false)
  whenever(couponCode, () => (couponCodeAdded.value = true))

  const isSubscribedPlan = computed(() => {
    const isCurrentPlan = currentPlan.value?.id === billing.value?.billing.plan_id

    return isCurrentPlan && billing.value?.billing.subscribed
  })

  watchEffect(async () => {
    const doNotMutate = !currentPlan.value?.id || !selectedUserLength.value || !billing.value?.billing.has_pm
    if (doNotMutate) return

    const input: PreviewAppSubscriptionInput = {
      price_id: currentPlan.value?.id as string,
      quantity: selectedUserLength.value,
    }
    if (couponCode.value) input.promotion_code = couponCode.value
    const key = currentKey.value
    const result = await mutatePreview({ input }).catch((error) => {
      previewPrice[key] = undefined
      onError?.(error, ErrorType.CouponCodeError)
      couponCodeAdded.value = false
    })
    if (!result) return

    previewPrice[key] = result?.data?.previewAppSubscription
    if (couponCodeAdded.value) onPreview?.()
    couponCodeAdded.value = false
  })

  const { result: creditsOverviewResult, loading: loadingGetCreditsOverview } = useQuery(GetCreditsOverviewDocument)
  const totalCredits = computed(() => {
    if (isSubscribed.value && previewPrice[currentKey.value]) return addDecimal(previewPrice[currentKey.value]?.credit)

    return (
      creditsOverviewResult.value?.creditsOverview
        ?.map(({ total }) => addDecimal(total))
        ?.reduce((acc, cur) => Decimal.add(acc, cur), new Decimal('0'))
        .toFixed(2) ?? '0.00'
    )
  })

  const discount = computed<null | [string, string]>(() => {
    if (!couponCode.value) return null
    if (!Number(previewPrice[currentKey.value]?.discount)) return [couponCode.value, '0.00']
    return [couponCode.value, addDecimal(previewPrice[currentKey.value]?.discount)]
  })

  const subtotalPrice = computed(() => {
    if (!currentPlan.value) return '0.00'

    return addDecimal(previewPrice[currentKey.value]?.total)
  })

  return {
    loading: computed(() => loadingGetCreditsOverview.value || loadingGetBilling.value || loadingPreview.value),
    isSubscribed,
    billing,
    refetchBilling,
    previewPrice,
    totalCredits,
    discount,
    subtotalPrice,
    billedNowPrice: subtotalPrice,
    isSubscribedPlan,
  }
}
