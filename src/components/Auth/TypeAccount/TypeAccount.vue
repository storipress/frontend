<script setup lang="ts">
import type { PropType } from 'vue'
import { Alert, Buttons, Inputs } from '@storipress/core-component'
import { useRouteQuery } from '@vueuse/router'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import Card from '~/components/Auth/Card/Card.vue'
import { useWithCurrentQuery } from '~/composables'
import type { LoginError } from '~/composables'

defineProps({
  checkEmailLoading: {
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
  (event: 'apply', val: { email: string; password: string }): void
  (event: 'initEmail'): void
}>()

const queryEmail = useRouteQuery<string>('email', '')
const loginEmail = ref(queryEmail.value)
const loginPassword = ref('')

const emailSchema = Yup.object().shape({
  email: Yup.string().email().required().label('Email'),
})

const { withQuery } = useWithCurrentQuery()

function onApply() {
  emit('apply', { email: loginEmail.value, password: loginPassword.value })
}
</script>

<template>
  <Card title="Log in" description="Continue to Storipress">
    <Form :validation-schema="emailSchema" class="mb-4" @submit="onApply">
      <Inputs
        v-model="loginEmail"
        label="Email"
        placeholder="john@doe.com"
        html-name="email"
        html-type="email"
        autocomplete="email"
        autofocus
      />
      <Inputs
        v-model="loginPassword"
        class="hidden"
        label="Password"
        placeholder="password"
        html-name="password"
        html-type="password"
        autocomplete="current-password"
      />

      <Alert v-if="error" type="danger" message="Error" class="mt-4">
        <template #description>
          <div class="text-body text-stone-800">
            {{ error.message }}
          </div>
        </template>
      </Alert>

      <Buttons
        type="main"
        color="primary"
        is-shadow
        html-type="submit"
        :disabled="!loginEmail || checkEmailLoading"
        class="mt-6 h-[4.5rem] w-full"
      >
        Next
      </Buttons>
    </Form>

    <div class="mb-14">
      <router-link v-slot="{ navigate }" to="/auth/password/reset" custom>
        <div
          role="button"
          class="text-body mb-2 text-emerald-700"
          @click="
            () => {
              navigate()
              $emit('initEmail')
            }
          "
        >
          Forgot password?
        </div>
      </router-link>
    </div>
  </Card>
</template>

<style scoped></style>
