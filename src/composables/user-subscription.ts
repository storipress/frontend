import { GetBillingDocument, GetMeDocument, GetSiteDocument } from '~/graphql-operations'
import { featureLoaded, Flags, useFeatureFlag } from '~/lib/feature-flag'

const PLUS_PLAN = new Set(['publisher', 'enterprise', 'storipress_tier3', 'storipress_bf_tier3', 'prophet'])

export function useUserSubscription() {
  const forcePlusPlan = useFeatureFlag(Flags.ForcePlusPlan)

  const { result: billingResult, loading: loadingBilling } = useQuery(GetBillingDocument)
  const { result: meResult, loading: loadingMe } = useQuery(GetMeDocument)
  const { result: siteResult, loading: loadingSite } = useQuery(GetSiteDocument)

  const currentPlan = computed(() => siteResult.value?.site?.plan)
  const isOwner = computed(() => meResult.value?.me?.role === 'owner')
  const isPlusPlan = computed(() => {
    if (forcePlusPlan.value) return true
    return currentPlan.value ? PLUS_PLAN.has(currentPlan.value) : false
  })
  const isLifetimePlan = computed(() => siteResult.value?.site?.plan.startsWith('storipress_'))
  const onTrial = computed(() => billingResult.value?.billing?.on_trial)

  const ready = computed(() => !loadingBilling.value && !loadingMe.value && !loadingSite.value && featureLoaded.value)

  return {
    onTrial,
    isPlusPlan,
    isOwner,
    isLifetimePlan,
    onTrialFree: computed(() => isOwner.value && onTrial.value),
    canAccessAllPlusFeatures: computed(() => onTrial.value || isPlusPlan.value),
    ready,
  }
}
