<route lang="yaml">
meta:
  layout: auth
</route>

<script setup lang="ts">
import TypeAccount from '~/components/Auth/TypeAccount/TypeAccount.vue'
import TypePassword from '~/components/Auth/TypePassword/TypePassword.vue'
import { LoginStep, useLogin, useLoginApi, useRedirect } from '~/composables/login'

const emit = defineEmits<(event: 'isLogin', val: boolean) => void>()

useHead({
  title: 'Log in - Storipress',
})

const { redirect } = useRedirect()
const { currentStep, error, isLogin, initEmailSessionStorage, onSubmit, checkEmailLoading, loading } = useLogin(
  useLoginApi(),
  redirect,
)

initEmailSessionStorage()
redirect()

watch(isLogin, (val) => {
  emit('isLogin', val)
})
</script>

<template>
  <component
    v-bind="{ checkEmailLoading, loading }"
    :is="currentStep === LoginStep.FillInEmail ? TypeAccount : TypePassword"
    :error="error"
    @apply="onSubmit"
    @change-step="(step: LoginStep) => (currentStep = step)"
  />
</template>

<style scoped></style>
