<script setup lang="ts">
import { Decimal } from 'decimal.js'
import { addDecimal } from '~/utils'
import { GetCreditsOverviewDocument } from '~/graphql-operations'
import { HelpButton } from '~/components/HelpButton'

withDefaults(defineProps<{ currency?: string }>(), {
  currency: 'USD',
})
const { result } = useQuery(GetCreditsOverviewDocument)
const creditsOverview = computed(() => result.value?.creditsOverview)

const totalCredits = computed(
  () =>
    result.value?.creditsOverview
      ?.map(({ total }) => addDecimal(total))
      ?.reduce((acc, curr) => Decimal.add(acc, curr).toFixed(2), '0') ?? '0.00',
)

const helpMessage = 'Accrued credits are automatically applied to your next bill on every new billing period.'
</script>

<template>
  <article v-if="!creditsOverview?.length" class="layer-1 mt-4 rounded-lg bg-white p-5 text-center">
    <h3 class="text-heading mb-[0.625rem]">
      There are no credits on your account right now
      <HelpButton>
        {{ helpMessage }}
      </HelpButton>
    </h3>
    <p class="text-body text-stone-500">Your credits will be shown here when you have them.</p>
  </article>

  <article v-else class="layer-1 mt-4 rounded-lg bg-white p-5 text-center">
    <h3 class="text-heading mb-4 text-left">
      Your billing credits
      <HelpButton>
        {{ helpMessage }}
      </HelpButton>
    </h3>
    <div
      v-for="{ type, amount, count, total } in creditsOverview"
      :key="type"
      class="text-caption mb-2 flex justify-between"
    >
      <p>${{ addDecimal(amount) }} {{ type }} credit x {{ count }}</p>
      <p>
        <span class="uppercase">{{ currency }}</span>
        {{ addDecimal(total) }}
      </p>
    </div>
    <hr class="my-2 border border-stone-200" />
    <div class="text-caption mt-2 flex justify-between font-bold">
      <p>Running total</p>
      <p>
        <span class="uppercase">{{ currency }}</span>
        {{ totalCredits }}
      </p>
    </div>
  </article>
</template>
