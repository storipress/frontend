<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'
import * as Yup from 'yup'
import { Alert, Icon, Buttons as SpButton, Inputs as SpInput } from '@storipress/core-component'
import { useStripe } from '~/hooks/useStripe'
import { useMutation } from '~/lib/apollo'
import { UpdateAppPaymentMethodDocument } from '~/graphql-operations'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'updated'): void
}>()

const { stripe, reference, elements } = useStripe()

const schema = Yup.object().shape({
  firstName: Yup.string().required('This field is required'),
  lastName: Yup.string().required('This field is required'),
  addressLine1: Yup.string().required('This field is required'),
  addressLine2: Yup.string(),
  city: Yup.string(),
  state: Yup.string().required('This field is required'),
  postcode: Yup.string().required('This field is required'),
})

const formData = reactive({
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postcode: '',
})

const { onDone, onError, mutate } = useMutation(UpdateAppPaymentMethodDocument)

const isLoading = ref(false)
const isError = ref(false)

async function confirmPayment() {
  isLoading.value = true
  isError.value = false

  const { setupIntent, error } =
    (await stripe.value?.confirmSetup({
      elements: elements.value,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: {
              line1: formData.addressLine1,
              line2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postcode,
            },
          },
        },
      },
    })) || {}

  if (error) {
    isLoading.value = false
    isError.value = true
    return
  }

  if (setupIntent?.status === 'succeeded') {
    mutate({ token: setupIntent.payment_method as string })
  } else {
    isLoading.value = false
    isError.value = true
  }
}

onDone(() => {
  isLoading.value = false
  emit('updated')
  emit('close')
})

onError(() => {
  isLoading.value = false
  isError.value = true
})

function onSubmit(event: any) {
  if (event.errors) {
    return
  }
  confirmPayment()
}
</script>

<template>
  <div>
    <div class="layer-1 flex-1 rounded-md bg-white px-5 pb-4 pt-[1.375rem]">
      <div class="flex items-center">
        <Icon icon-name="billing" class="mr-4 text-4xl text-stone-600"></Icon>
        <div>
          <h2 class="text-display-small text-stone-800">Add payment method</h2>
          <p class="text-heading text-stone-400">This card is used for all your upcoming bills</p>
        </div>
      </div>

      <hr class="mb-5 mt-4 border-stone-200" />

      <Alert
        v-if="isError"
        type="danger"
        message="There was an error adding your card"
        description="We could not verify your credit card. Transaction declined."
        class="mb-4 max-w-none"
      />

      <VeeForm :validation-schema="schema" class="flex flex-col" @submit="onSubmit" @invalid-submit="onSubmit">
        <div class="layer-1 rounded-md bg-gray-100">
          <h3 class="text-subheading mx-5 mt-5 text-stone-800">Credit card information</h3>
          <div ref="reference" class="px-5 pb-5 pt-4" />

          <hr class="border-stone-200" />

          <div class="p-5">
            <h3 class="text-subheading mb-4 text-stone-800">Billing address</h3>
            <div class="mb-4 flex gap-4">
              <SpInput v-model="formData.firstName" class="flex-1" label="First name" html-name="firstName" />
              <SpInput v-model="formData.lastName" class="flex-1" label="Last name" html-name="lastName" />
            </div>
            <SpInput v-model="formData.addressLine1" class="mb-4" label="Address" html-name="addressLine1" />
            <SpInput
              v-model="formData.addressLine2"
              class="mb-4"
              label="Apartment, suite, etc."
              html-name="addressLine2"
            />
            <div class="flex gap-4">
              <SpInput v-model="formData.city" label="Suburb" html-name="city" />
              <SpInput v-model="formData.state" label="State/territory" html-name="state" />
              <SpInput v-model="formData.postcode" label="Postcode" html-name="postcode" />
            </div>
          </div>
        </div>

        <hr class="my-4 border-stone-200" />

        <SpButton
          class="ml-auto flex min-w-[8.375rem]"
          type="main"
          color="primary"
          html-type="submit"
          :is-loading="isLoading"
        >
          Add credit card
        </SpButton>
      </VeeForm>
    </div>
  </div>
</template>
