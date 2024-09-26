<script lang="ts" setup>
import { Decimal } from 'decimal.js'
import { Alert, Chips, Buttons as SpButton } from '@storipress/core-component'
import type { GetAppSubscriptionPlansQuery } from '~/graphql-operations'
import { addDecimal } from '~/utils'
import { useCheckoutDialog } from '~/hooks/useCheckoutDialog'

interface Props {
  modelValue: string
  subscriptionPlans: GetAppSubscriptionPlansQuery
  loading: boolean
  seats: number
  error: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  subscriptionPlans: undefined,
  loading: true,
  seats: 2,
  error: false,
})

const emit = defineEmits<{
  (event: 'next'): void
  (event: 'update:modelValue', value: string): void
}>()

const { checkoutMode } = useCheckoutDialog()

const selectedId = useVModel(props, 'modelValue', emit)

const subscriptionPlans = toRef(props, 'subscriptionPlans')

const { groupKey } = useCheckoutDialog()

interface Plan {
  id: string
  title: 'Yearly' | 'Monthly'
  info: string[]
  price: string
  save?: string
}

const monthlyPlan = computed<Plan | null>(() => {
  const plan = subscriptionPlans.value?.appSubscriptionPlans?.find(({ group, interval, interval_count }) => {
    return group === groupKey.value && interval === 'month' && interval_count === 1
  })
  if (!plan) return null

  return {
    id: plan.id,
    title: 'Monthly',
    price: plan.price,
    info: [`${plan.currency.toUpperCase()} ${addDecimal(plan.price)} x ${props.seats} seats,`, 'calculated monthly'],
  }
})

const yearlyPlan = computed<Plan | null>(() => {
  const plan = subscriptionPlans.value?.appSubscriptionPlans?.find(({ group, interval, interval_count }) => {
    return group === groupKey.value && interval === 'year' && interval_count === 1
  })
  if (!plan) return null

  const price = Decimal.div(plan.price, 12 * 100).toFixed(2)
  const monthlyPrice = monthlyPlan.value?.price
  const planData: Plan = {
    id: plan.id,
    title: 'Yearly',
    price: plan.price,
    info: [`${plan.currency.toUpperCase()} ${price} x ${props.seats} seats`, 'x 12 months'],
  }
  if (!monthlyPrice) {
    return planData
  }

  const monthlyTotal = Decimal.mul(monthlyPrice, 12)
  const save = monthlyTotal.sub(plan.price).div(100).toFixed()
  return {
    ...planData,
    save: `Save $${save}`,
  }
})

whenever(yearlyPlan, ({ id }) => {
  selectedId.value = id
})

const planList = computed(() => [yearlyPlan.value, monthlyPlan.value].filter(Boolean) as Plan[])
</script>

<template>
  <div class="flex flex-col">
    <h2 class="text-display-small mb-4 mr-[4.875rem] text-stone-900">
      Based on your usage, we recommend the
      <span class="capitalize">{{ checkoutMode }}</span>
      Plan.
    </h2>
    <form v-if="planList" class="flex gap-2" @submit.prevent>
      <label
        v-for="plan in planList"
        :key="plan.id"
        :for="plan.id"
        class="layer-1 flex-1 cursor-pointer rounded-lg p-4 transition-shadow hover:layer-2"
        :class="{ 'opacity-50 transition hover:opacity-100': selectedId !== plan.id }"
      >
        <input
          :id="plan.id"
          v-model="selectedId"
          type="radio"
          name="plan"
          :value="plan.id"
          class="hidden w-0"
          :checked="selectedId === plan.id"
        />
        <div class="mb-[.125rem] flex h-5 items-center justify-between">
          <p class="text-button text-stone-800">{{ plan.title }}</p>
          <Chips v-if="plan.save" :label="plan.save" color="primary" class="h-5" />
        </div>
        <p v-for="(text, i) in plan.info" :key="i" class="text-caption text-stone-600">{{ text }}</p>
      </label>
    </form>

    <hr class="mb-4 mt-6 border-t border-stone-200" />

    <Alert
      v-if="error"
      class="mb-4"
      type="danger"
      message="Error adding card"
      description="We could not verify your credit card. Transaction declined."
    />

    <slot>
      <div class="h-[300px]" />
    </slot>

    <div class="flex-1" />

    <SpButton
      class="mt-4 w-full"
      type="main"
      color="primary"
      html-type="submit"
      :is-loading="loading"
      @click="emit('next')"
    >
      Upgrade and Invite User
    </SpButton>
  </div>
</template>
