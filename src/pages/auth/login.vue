<route lang="yaml">
meta:
  layout: auth
</route>

<script setup lang="ts">
import TypeAccount from '~/components/Auth/TypeAccount/TypeAccount.vue'
import TypePassword from '~/components/Auth/TypePassword/TypePassword.vue'
import { LoginStep, useLogin, useLoginApi } from '~/composables/login'

const emit = defineEmits<(event: 'isLogin', val: boolean) => void>()

useHead({
  title: 'Log in - Storipress',
})

const {
  currentStep,
  error,
  loginForm,
  isLogin,
  initEmailSessionStorage,
  onSubmit,
  checkEmailLoading,
  loading,
  onAfterLogin,
} = useLogin(useLoginApi())

onAfterLogin(() => {
  sendTrackUnchecked('user_logged_in')
})

const passwordProps = computed(() =>
  currentStep.value === LoginStep.FillInPassword ? { password: loginForm.password } : {},
)

watch(isLogin, (val) => {
  emit('isLogin', val)
})
</script>

<template>
  <component
    v-bind="{ checkEmailLoading, loading, ...passwordProps }"
    :is="currentStep === LoginStep.FillInEmail ? TypeAccount : TypePassword"
    :error="error"
    @apply="onSubmit"
    @init-email="initEmailSessionStorage"
    @change-step="(step: LoginStep) => (currentStep = step)"
  />
</template>

<style scoped></style>
