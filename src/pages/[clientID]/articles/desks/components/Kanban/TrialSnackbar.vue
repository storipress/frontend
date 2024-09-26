<script lang="ts" setup>
import { mergeTailwind } from '@storipress/core-component'
import { RouterLink } from 'vue-router'
import { dayjs } from '~/lib/dayjs'
import { useQuery } from '~/lib/apollo'
import { GetBillingDocument } from '~/graphql-operations'
import { useWorkspaceStore } from '~/stores/workspace'
import { usePublicationPermission } from '~/composables/permission/publication'
import { useFeatureFlagEvery, useFeatureValue } from '~/lib/feature-flag'

const workspaceStore = useWorkspaceStore()

const { canUseBilling } = usePublicationPermission()

const enabled = useFeatureFlagEvery(['billing', 'trial-snackbar'])
const closeAfter = useFeatureValue<number>('trial-snackbar-hide-day', 0)

const { result: billingQueryResult } = useQuery(GetBillingDocument)
const state = computed(() => {
  if (billingQueryResult.value) {
    const { billing: { on_trial, subscribed, trial_ends_at } = {} } = billingQueryResult.value
    const leftDaysInTrial = trial_ends_at ? dayjs(trial_ends_at).diff(dayjs(), 'day') : -(closeAfter.value + 1)
    const isTrialSnackbarExtendPeriod =
      closeAfter.value <= 0 || on_trial || (leftDaysInTrial <= 0 && leftDaysInTrial > -closeAfter.value)

    return {
      // showing snackbar only if:
      // - enable with feature flag
      // - can manage billing
      // - don't have a paid plan
      // - has extend period
      isShowSnackBar: enabled.value && canUseBilling.value && !subscribed && isTrialSnackbarExtendPeriod,
      isInTrial: on_trial,
      leftDaysInTrial,
    }
  }
})
</script>

<template>
  <div v-if="state?.isShowSnackBar" :class="mergeTailwind(['flex h-12 items-center justify-center bg-stone-800'])">
    <span v-if="state.isInTrial" class="text-body mr-[1.188rem] text-base font-medium text-white">
      You have {{ state.leftDaysInTrial }} days left in your trial
    </span>
    <span v-else class="text-body mr-[1.188rem] text-base font-medium text-white">
      Your free trial to Premium has expired
    </span>
    <RouterLink
      :to="`/${workspaceStore?.currentWorkspace?.id}/account/billing`"
      class="text-button inline-flex h-9 items-center justify-center rounded bg-primary px-4 py-2.5 text-white hover:bg-emerald-900 focus:outline-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      Select a plan
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped></style>
