import type { Ref } from 'vue'
import { GetBillingDocument } from '~/graphql-operations'

interface UseIsPaidUserReturn {
  /**
   * is user paid
   *
   * @notice it assume user is not paid and become to `true` if user is paid
   */
  isPaid: Ref<boolean>
  /**
   * is user not paid
   *
   * @notice it assume user is paid and become to `true` if user is not paid
   */
  isNotPaid: Ref<boolean>
}

export function useIsPaidUser(): UseIsPaidUserReturn {
  const { result } = useQuery(GetBillingDocument)

  const isPaid = computed(() => {
    if (!result.value) return false
    return result.value.billing.subscribed
  })

  const isNotPaid = computed(() => {
    if (!result.value) return false
    return !result.value.billing.subscribed
  })

  return {
    isPaid,
    isNotPaid,
  }
}
