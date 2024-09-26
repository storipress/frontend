<script lang="ts" setup>
import { Form as VeeForm } from 'vee-validate'
import { Buttons as SpButton, Inputs as SpInput } from '@storipress/core-component'
import { schemaPaymentAddressForm } from './schema'
import { useCheckoutDialog } from '~/hooks/useCheckoutDialog'

interface Props {
  modelValue: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    postcode: string
    couponCode: string
  }
  loading: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postcode: '',
    couponCode: '',
  }),
  loading: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'verified'): void
}>()

const { checkoutMode } = useCheckoutDialog()

const formData = useVModel(props, 'modelValue', emit)

function onSubmit(event: any) {
  if (event.errors) return
  emit('verified')
}
</script>

<template>
  <div class="flex flex-col">
    <h2 class="text-display-small mb-4 mr-[4.875rem] text-stone-900">
      Based on your usage, we recommend the
      <span class="capitalize">{{ checkoutMode }}</span>
      Plan.
    </h2>
    <h3 class="text-subheading mb-[1.625rem] mt-4 text-stone-800">Billing address</h3>
    <VeeForm
      :validation-schema="schemaPaymentAddressForm"
      class="flex flex-1 flex-col"
      @submit="onSubmit"
      @invalid-submit="onSubmit"
    >
      <div class="mb-4 flex gap-4">
        <SpInput v-model="formData.firstName" class="flex-1" label="First name" html-name="firstName" />
        <SpInput v-model="formData.lastName" class="flex-1" label="Last name" html-name="lastName" />
      </div>
      <SpInput v-model="formData.addressLine1" class="mb-4" label="Address" html-name="addressLine1" />
      <SpInput v-model="formData.addressLine2" class="mb-4" label="Apartment, suite, etc." html-name="addressLine2" />
      <div class="flex gap-4">
        <SpInput v-model="formData.city" label="Suburb" html-name="city" />
        <SpInput v-model="formData.state" label="State/territory" html-name="state" />
        <SpInput v-model="formData.postcode" label="Postcode" html-name="postcode" />
      </div>

      <SpInput
        v-model="formData.couponCode"
        label="Coupon code"
        placeholder="Coupon code"
        html-name="couponCode"
        html-type="text"
        class="mt-3"
      />

      <div class="flex-1" />

      <SpButton class="flex w-full" type="main" color="primary" html-type="submit" :is-loading="loading">
        Complete
      </SpButton>
    </VeeForm>
  </div>
</template>
