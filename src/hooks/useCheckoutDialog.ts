import { captureException } from '@sentry/vue'
import invariant from 'tiny-invariant'
import { GetBillingDocument, GetSiteCustomSiteDocument } from '~/graphql-operations'
import { RoleCode } from '~/utils/definition'

export const paidRoleList = [RoleCode.admin, RoleCode.editor]
export enum PlanStatus {
  Trial = 'Trial',
  Free = 'Free',
  Subscribed = 'Subscribed',
}

export type Mode = 'standard' | 'plus'
export type StripePlanGroup = 'blogger' | 'publisher' | 'prophet'
export type AppSumoPlanGroup = 'storipress_tier1' | 'storipress_tier2' | 'storipress_tier3'
export type AppSumoBfPlanGroup = 'storipress_bf_tier1' | 'storipress_bf_tier2' | 'storipress_bf_tier3'
export type AllPlanGroup = StripePlanGroup | AppSumoPlanGroup | AppSumoBfPlanGroup

const stripePlan = new Set<StripePlanGroup>(['blogger', 'publisher', 'prophet'])
const appSumoPlan = new Set<AppSumoPlanGroup>(['storipress_tier1', 'storipress_tier2', 'storipress_tier3'])
const appSumoBfPlan = new Set<AppSumoBfPlanGroup>(['storipress_bf_tier1', 'storipress_bf_tier2', 'storipress_bf_tier3'])

const allPlan = new Set<AllPlanGroup>([...stripePlan, ...appSumoPlan, ...appSumoBfPlan])
const plusPlan = new Set(['publisher', 'storipress_tier3', 'prophet'])

const isOpen = ref(false)
const checkoutMode = ref<Mode>('standard')
const checkoutFrom = ref('')
const checkoutDone = ref<Mode | null>()

export function useCheckoutDialog() {
  const { result: billingQueryResult, refetch: refetchBilling, loading: loadingBilling } = useQuery(GetBillingDocument)
  const { result: siteQueryResult, loading: loadingSite } = useQuery(GetSiteCustomSiteDocument)
  const billing = computed(() => billingQueryResult.value?.billing)
  const isAppSumo = computed(() => billing.value?.source === 'appsumo')
  function toAppSumo() {
    const appSumoPath = isAppSumo.value
      ? `https://appsumo.com/account/redemption/${billing.value?.plan_id || ''}#change-plan`
      : null
    invariant(appSumoPath, 'No AppSumo path')
    location.href = appSumoPath
  }

  watch(checkoutDone, () => refetchBilling())

  const openDialog = (mode: Mode = 'standard', from = '') => {
    if (isAppSumo.value) {
      toAppSumo()
      return false
    }

    checkoutMode.value = mode
    checkoutFrom.value = from
    if (billing.value?.subscribed && checkoutDone.value === checkoutMode.value) return true

    isOpen.value = true
    return Promise.any([until(checkoutDone).toBeTruthy(), until(isOpen).not.toBeTruthy()])
  }
  const closeDialog = () => (isOpen.value = false)
  const doneCheckout = () => {
    checkoutDone.value = checkoutMode.value
    isOpen.value = false
  }

  const planStatus = computed(() => {
    const plan = siteQueryResult.value?.site.plan as AllPlanGroup | undefined
    if (!plan) return PlanStatus.Free
    if (allPlan.has(plan)) {
      return PlanStatus.Subscribed
    }
    if ((plan as string) !== 'free') {
      captureException(new Error(`found unknown plan: ${plan}`))
    }
    return PlanStatus.Free
  })

  const groupKey = computed(() => {
    const modeGroupMap: Record<Mode, AllPlanGroup> = {
      standard: 'blogger',
      plus: 'publisher',
    }
    return modeGroupMap[checkoutMode.value]
  })

  const isPlusPlan = computed(() => {
    const plan = siteQueryResult.value?.site.plan as AllPlanGroup
    return plusPlan.has(plan)
  })

  const isFreePlan = computed(() => {
    return planStatus.value === PlanStatus.Free
  })

  const loading = computed(() => loadingBilling.value || loadingSite.value)

  async function requirePlusPlan(source: string) {
    if (isPlusPlan.value) {
      return true
    }

    return await openDialog('plus', source)
  }

  return {
    isOpen,
    checkoutMode,
    checkoutFrom,
    billing,
    planStatus,
    loadingBilling,
    loading,
    groupKey,
    isPlusPlan,
    isFreePlan,
    refetchBilling,
    openDialog,
    closeDialog,
    doneCheckout,
    checkPaidRole,
    requirePlusPlan,
  }
}

export default useCheckoutDialog

export function checkPaidRole(roleCode: number | string) {
  return paidRoleList.includes(Number(roleCode))
}
