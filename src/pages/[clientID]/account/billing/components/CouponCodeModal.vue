<script setup lang="ts">
import type { NotificationFactory } from '@storipress/core-component'
import { Alert, Icon, Buttons as SpButton, Inputs as SpInput } from '@storipress/core-component'
import { ApplyCouponCodeToAppSubscriptionDocument } from '~/graphql-operations'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'updated'): void
}>()

const notifications = inject('notifications') as NotificationFactory

const couponCode = ref('')

const { mutate, onError } = useMutation(ApplyCouponCodeToAppSubscriptionDocument)
const error = ref(false)
onError(() => (error.value = true))

whenever(couponCode, () => (error.value = false))

async function onSubmit() {
  const result = await mutate({ code: couponCode.value })
  if (!result?.data?.applyCouponCodeToAppSubscription) return (couponCode.value = '')

  emit('updated')
  emit('close')
  notifications({
    title: 'Coupon code added',
    type: 'primary',
    content: 'Discount applied.',
  })
}
</script>

<template>
  <div class="layer-1 flex-1 rounded-md bg-white px-5 pb-4 pt-[1.375rem]">
    <div class="flex items-center">
      <Icon icon-name="billing" class="mr-4 text-4xl text-stone-600" />
      <div>
        <h2 class="text-display-small text-stone-800">Add coupon code</h2>
        <p class="text-heading text-stone-400">Enter your coupon code below:</p>
      </div>
    </div>

    <hr class="mb-5 mt-4 border-stone-200" />

    <Alert
      v-if="error"
      type="danger"
      message="Invalid coupon code"
      description="The coupon entered has expired or is invalid"
      class="mb-4 max-w-none"
    />

    <form class="mt-4 flex w-[37.5rem] rounded-lg bg-gray-100 p-5 pt-[1.375rem] shadow-1-layer" @submit.prevent>
      <SpInput
        v-model="couponCode"
        label="Coupon code"
        class="flex-1"
        html-type="text"
        placeholder="Coupon code"
        html-name="couponCode"
        :autofocus="true"
      />
    </form>

    <hr class="mb-4 mt-5 border-stone-200" />

    <SpButton
      class="ml-auto block"
      type="main"
      color="primary"
      html-type="submit"
      :disabled="!couponCode || error"
      @click="onSubmit"
    >
      Add coupon code
    </SpButton>
  </div>
</template>
