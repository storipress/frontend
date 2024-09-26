<script setup lang="ts">
import type { PropType } from 'vue'
import { Alert, Buttons, Inputs } from '@storipress/core-component'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import Card from '~/components/Auth/Card/Card.vue'
import { useAuthStore } from '~/stores/auth'
import { ErrorKey } from '~/composables'
import type { LoginError } from '~/composables'

const props = defineProps({
  loading: {
    type: Boolean,
  },
  password: {
    type: String,
    default: '',
  },
  error: {
    type: Object as PropType<LoginError>,
    default: undefined,
  },
})
const emit = defineEmits<{
  (event: 'changeStep', val: number): void
  (event: 'apply', val: { password: string }): void
}>()

const loginPassword = ref(props.password)

const isRateLimitError = computed(() => props.error?.key === ErrorKey.RateLimit)

const userEmail = useSessionStorage('user-email', '')
const store = useAuthStore()

const passwordSchema = Yup.object().shape({
  password: Yup.string().min(8).required().label('Password'),
})

function onApply() {
  emit('apply', { password: loginPassword.value })
}
</script>

<template>
  <Card title="Log in" description="Continue to Storipress" margin-top="mt-5">
    <Alert
      v-if="store.isResetPassword"
      message="Request for Password Reset Sent"
      description="A link to reset your password has been emailed to you."
    />

    <div class="text-body mb-6 mt-8 flex justify-between">
      <div>
        <span class="text-stone-900">{{ userEmail }}</span>
      </div>
      <div role="button" @click="emit('changeStep', 0)"><span class="text-emerald-700">Change email</span></div>
    </div>

    <Form :validation-schema="passwordSchema" class="mb-4" @submit="onApply">
      <Inputs
        v-model="loginPassword"
        label="Password"
        html-name="password"
        html-type="password"
        autocomplete="current-password"
        autofocus
      />

      <Alert v-if="error" type="danger" :message="isRateLimitError ? 'Error' : error.message" class="mt-4">
        <template #description>
          <div class="text-body text-stone-800">
            <template v-if="isRateLimitError">
              {{ error.message }}
            </template>
            <template v-else>
              Forgot your password? Reset it
              <router-link class="text-gray-500 hover:text-gray-500" to="/auth/password/reset"
                >here <i class="icon-goto-url text-[0.7rem]" />
              </router-link>
            </template>
          </div>
        </template>
      </Alert>

      <Buttons
        type="main"
        color="primary"
        is-shadow
        html-type="submit"
        :disabled="loading"
        class="mt-6 h-[4.5rem] w-full"
      >
        Log in
      </Buttons>
    </Form>

    <div role="button" class="text-body">
      <router-link class="text-emerald-700" to="/auth/password/reset">Forgot password?</router-link>
    </div>
  </Card>
</template>

<style scoped></style>
