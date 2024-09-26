<route lang="yaml">
meta:
  layout: auth
</route>

<script setup lang="ts">
import { Buttons, Inputs } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import { object as yupObject, string as yupString } from 'yup'
import Card from '~/components/Auth/Card/Card.vue'
import { ForgotPasswordDocument } from '~/graphql-operations'
import { useAuthStore } from '~/stores/auth'

useHead({
  title: 'Reset password - Storipress',
})

const store = useAuthStore()
const router = useRouter()
const emailInput = ref('')
const userEmail = useStorage('user-email', '', sessionStorage)

const description = computed(() => {
  return userEmail.value
    ? `We’ll email instructions to ${userEmail.value} on how to reset it`
    : 'We’ll send instructions to your email address on how to reset it'
})

const schema = yupObject().shape({
  email: yupString().email().required().label('Email'),
})
const { handleSubmit } = useForm({
  initialValues: {
    email: userEmail.value,
  } as Record<string, string>,
  validationSchema: schema,
})

const { onDone, mutate } = useMutation(ForgotPasswordDocument)

onDone(({ data }) => {
  if (emailInput.value) {
    userEmail.value = emailInput.value
  }
  if (data?.forgotPassword) {
    store.isResetPassword = true
    router.push('/auth/login')
  }
})

const onReset = handleSubmit(() => {
  mutate({
    email: userEmail.value || emailInput.value,
  })
})

function onBackLogin(navigate) {
  userEmail.value = null
  navigate()
}
</script>

<template>
  <Card title="Forgot your password?">
    <template #description>
      <span class="text-body text-stone-500">{{ description }}</span>
    </template>
    <form>
      <div v-if="userEmail" class="text-body mb-6 flex justify-between">
        <div>
          <span class="text-stone-900">{{ userEmail }}</span>
        </div>
        <div role="button">
          <RouterLink v-slot="{ navigate }" to="/auth/login" custom>
            <div role="button" class="text-body text-emerald-700" @click="onBackLogin(navigate)">Change email</div>
          </RouterLink>
        </div>
      </div>
      <div v-else class="mb-6">
        <Inputs
          v-model="emailInput"
          label="Email"
          placeholder="john@doe.com"
          html-name="email"
          html-type="email"
          autocomplete="email"
          autofocus
          class="w-full"
        />
      </div>

      <Buttons type="main" color="primary" is-shadow class="mb-4 h-[4.5rem] w-full" @click="onReset">
        Reset Password
      </Buttons>

      <RouterLink v-slot="{ navigate }" to="/auth/login" custom>
        <div role="button" class="text-body text-emerald-700" @click="onBackLogin(navigate)">Return to login</div>
      </RouterLink>
    </form>
  </Card>
</template>
