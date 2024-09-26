<route lang="yaml">
meta:
  layout: auth
</route>

<script setup lang="ts">
import { Buttons, Inputs } from '@storipress/core-component'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import Card from '~/components/Auth/Card/Card.vue'
import { ResetPasswordDocument } from '~/graphql-operations'

useHead({
  title: 'Create password - Storipress',
})

const newPassword = ref('')
const newPasswordConfirm = ref('')

const schema = Yup.object().shape({
  newPassword: Yup.string().min(8).required().label('New password'),
  confirmNewPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('newPassword')], 'Password do not match')
    .label('Confirm new password'),
})

const route = useRoute()
const router = useRouter()
const { email, token, expire_on, signature } = route.query
const expired = Number(expire_on)
const currentTime = Date.now()
const { onDone, mutate } = useMutation(ResetPasswordDocument)

if (currentTime > expired * 1000 || !token) router.replace('/auth/login')

onDone(() => {
  router.replace('/auth/login')
})

function onReset() {
  mutate({
    input: {
      email: email as string,
      password: newPassword.value,
      token: token as string,
      expired_at: expired,
      signature: signature as string,
    },
  })
}
</script>

<template>
  <Card title="Reset account password">
    <template #description>
      <span class="text-body text-stone-500">For the account {{ email }}</span>
    </template>
    <Form :validation-schema="schema" @submit="onReset">
      <Inputs
        v-model="newPassword"
        label="New password"
        class="mb-4 w-full"
        html-type="password"
        html-name="newPassword"
        autocomplete="new-password"
      />
      <Inputs
        v-model="newPasswordConfirm"
        label="Confirm new password"
        class="mb-6 w-full"
        html-type="password"
        html-name="confirmNewPassword"
        autocomplete="new-password"
      />
      <Buttons type="main" color="primary" is-shadow html-type="submit" class="h-[4.5rem] w-full">
        Reset password
      </Buttons>
    </Form>
  </Card>
</template>

<style scoped></style>
