<script setup lang="ts">
import { Tooltip } from '@storipress/core-component'
import { lifetimePlans } from '../../definition'
import { dayjs } from '~/lib/dayjs'
import { addDecimal } from '~/utils'
import type { GetBillingQuery } from '~/graphql-operations'

const props = withDefaults(
  defineProps<{
    plan?: string
    currency?: string
    billing?: GetBillingQuery['billing']
  }>(),
  {
    plan: '',
    currency: 'USD',
    billing: undefined,
  },
)

const route = useRoute()

const date = computed(() => (props.billing?.canceled ? '' : props.billing?.next_pm_date))
const credit = computed(() => addDecimal(props.billing?.credit_balance))

const isLifetimePlan = computed(() => lifetimePlans.has(props.billing?.plan ?? ''))

const subtotalPrice = computed(() => {
  if (props.billing?.interval === 'trial') return addDecimal(3)

  return addDecimal(props.billing?.next_pm_subtotal)
})
const tax = computed(() => addDecimal(props.billing?.next_pm_tax))
const taxPercentage = computed(
  () => props.billing?.next_pm_taxes?.find(({ amount }) => amount === props.billing?.next_pm_tax)?.percentage,
)
const discounts = computed(() => props.billing?.next_pm_discounts)
const totalPrice = computed(() => addDecimal(props.billing?.next_pm_total))
</script>

<template>
  <article v-if="isLifetimePlan" class="layer-1 rounded-lg bg-white p-5 text-center">
    <h3 class="text-heading mb-[0.625rem]">You are on a lifetime plan</h3>
  </article>
  <article v-else-if="!date" class="layer-1 rounded-lg bg-white p-5 text-center">
    <h3 class="text-heading mb-[0.625rem]">You are not currently on a billing cycle</h3>
    <router-link class="text-body text-stone-500" :to="`/${route.params.clientID}/account/billing/plans`">
      Select a plan
    </router-link>
  </article>
  <article v-else class="layer-1 rounded-lg bg-white p-5 text-center">
    <h3 class="text-heading mb-4 text-left">
      Current billing cycle: Billed on {{ dayjs(date).format('DD MMMM YYYY') }}
    </h3>
    <div class="text-caption mb-2 flex justify-between">
      <p>{{ plan }}</p>
      <p>
        <span class="uppercase">{{ currency }}</span> {{ subtotalPrice }}
      </p>
    </div>
    <div v-if="taxPercentage" class="text-caption mb-2 flex justify-between">
      <p>Tax</p>
      <p>
        <span class="uppercase">{{ currency }}</span>
        {{ tax }}
        <span v-if="Number(tax)">({{ taxPercentage }}%)</span>
      </p>
    </div>
    <div class="text-caption mb-2 flex justify-between">
      <p>
        Credit
        <Tooltip class="mx-2">
          <div class="w-[21rem] p-4 text-left">
            <div class="text-button mb-[0.375rem] text-stone-800">Credits will be applied next billing cycle</div>
            <div class="text-body text-stone-400">
              You have credits, but due to the peculiarities of how Stripe works, Stripe will only use them on your next
              billing cycle.
            </div>
          </div>
        </Tooltip>
      </p>
      <p>
        <span class="uppercase">{{ currency }}</span>
        {{ Number(credit) === 0 ? '' : '-' }}
        {{ credit }}
      </p>
    </div>
    <div v-for="{ amount, name } in discounts" :key="name" class="text-caption flex justify-between">
      <p>{{ name }}</p>
      <p>
        <span class="uppercase">{{ currency }}</span>
        {{ Number(amount) === 0 ? '' : '-' }}
        {{ addDecimal(amount) }}
      </p>
    </div>
    <hr class="my-4 border border-stone-200" />
    <div class="text-caption flex justify-between font-bold">
      <p>Running total</p>
      <p>
        <span class="uppercase">{{ currency }}</span>
        {{ totalPrice }}
      </p>
    </div>
  </article>
</template>
